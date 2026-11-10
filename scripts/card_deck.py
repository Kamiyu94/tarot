#!/usr/bin/env python3
"""Stage a complete candidate tarot deck without overwriting existing artwork.

Requires Pillow for image inspection and format conversion. Run from any directory.
Use `init`, `import ID SOURCE`, `check`, or `apply`. Only `apply` changes the live
card mapping, and it refuses incomplete decks. SOURCE must be a generated image
saved under output/card-deck/<deck>/sources/; existing artwork cannot be imported.
"""
from __future__ import annotations

import argparse
import fcntl
import hashlib
import html
import json
import re
import shutil
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "js/tarot-data.js"
EXPECTED_COUNT = 78
ENCODING_PROFILE = {'format': 'WEBP', 'maxWidth': 640, 'maxHeight': 960, 'quality': 84, 'method': 6}
LEGACY_ENCODING_PROFILE = {'format': 'WEBP', 'maxWidth': 768, 'maxHeight': 1152, 'quality': 88, 'method': 6}
LEGACY_CONFIG = {
    "manga-adventure-v1": {
        "label": "鳥山明風格・冒險漫畫候選牌面",
        "sampleIds": [0, 8, 46],
    }
}


def now():
    return datetime.now(timezone.utc).isoformat()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def relative(path):
    return path.resolve().relative_to(ROOT).as_posix()


def read_cards():
    text = DATA.read_text(encoding="utf-8")
    match = re.search(r"const\s+TAROT_CARDS\s*=\s*", text)
    if not match:
        raise ValueError("TAROT_CARDS assignment not found")
    cards, _ = json.JSONDecoder().raw_decode(text[match.end():])
    if len(cards) != EXPECTED_COUNT or {c["id"] for c in cards} != set(range(EXPECTED_COUNT)):
        raise ValueError("Expected exactly 78 unique card IDs (0–77)")
    return text, cards


def image_info(path):
    with Image.open(path) as image:
        image.verify()
    with Image.open(path) as image:
        return {"width": image.width, "height": image.height}


def deck_paths(deck):
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{0,63}", deck):
        raise ValueError("Deck name must be a lowercase slug")
    folder = ROOT / "output/card-deck" / deck
    candidates = ROOT / "images/cards" / deck
    return folder, candidates


def save_manifest(folder, manifest):
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / "manifest.json"
    temporary = folder / "manifest.json.tmp"
    temporary.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def initialize(deck, label=None, sample_ids=None):
    folder, candidates = deck_paths(deck)
    path = folder / "manifest.json"
    if path.exists():
        manifest = json.loads(path.read_text(encoding="utf-8"))
        if label is not None and label != manifest["label"]:
            raise ValueError("Existing deck label differs; create a new deck instead of overwriting")
        if sample_ids is not None and sample_ids != manifest["sampleIds"]:
            raise ValueError("Existing sample order differs; create a new deck instead of overwriting")
        return manifest
    fallback = LEGACY_CONFIG.get(deck, {})
    label = label or fallback.get("label")
    sample_ids = sample_ids if sample_ids is not None else fallback.get("sampleIds")
    if not label or not sample_ids:
        raise ValueError("Initialize a new deck with init --label LABEL --sample-ids ID [ID ...]")
    if len(set(sample_ids)) != len(sample_ids) or any(cid not in range(EXPECTED_COUNT) for cid in sample_ids):
        raise ValueError("Sample IDs must be unique card IDs between 0 and 77")
    _, cards = read_cards()
    entries = []
    for card in cards:
        original = ROOT / card["image"]
        if not original.is_file():
            raise ValueError(f"Missing original image: {card['image']}")
        entries.append({
            "id": card["id"], "name": card["name"], "nameEn": card["nameEn"],
            "originalImage": card["image"], "originalSha256": digest(original),
            "originalDimensions": image_info(original),
            "expectedImage": relative(candidates / f"card-{card['id']:02d}.webp"),
            "candidateImage": None, "sourcePath": None, "sourceSha256": None,
            "sourceDimensions": None, "status": "pending", "dimensions": None,
            "sha256": None, "importedAt": None,
            "character": None, "series": None, "referenceUrls": [],
        })
    manifest = {
        "schemaVersion": 2, "deck": deck, "label": label,
        "createdAt": now(), "expectedCount": EXPECTED_COUNT,
        "sampleIds": sample_ids, "tarotDataSha256": digest(DATA),
        "application": {"state": "not_applied"}, "cards": entries,
        "encodingProfile": dict(ENCODING_PROFILE),
    }
    save_manifest(folder, manifest)
    return manifest


def validate(deck, manifest, require_complete=False, require_sources=True):
    folder, candidates = deck_paths(deck)
    issues = []
    _, cards = read_cards()
    current = {c["id"]: c for c in cards}
    entries = manifest.get("cards", [])
    if manifest.get("deck") != deck or manifest.get("expectedCount") != EXPECTED_COUNT:
        issues.append("Deck identity or expected count differs")
    sample_ids = manifest.get("sampleIds", [])
    if not sample_ids or len(set(sample_ids)) != len(sample_ids) or any(cid not in range(EXPECTED_COUNT) for cid in sample_ids):
        issues.append("Invalid or duplicate sample IDs")
    if len(entries) != EXPECTED_COUNT or {c["id"] for c in entries} != set(range(EXPECTED_COUNT)):
        issues.append("Manifest must contain exactly IDs 0–77")
        return issues
    applied = manifest.get("application", {}).get("state") == "applied"
    expected_data_hash = manifest["application"].get("dataSha256") if applied else manifest["tarotDataSha256"]
    if digest(DATA) != expected_data_hash:
        issues.append("Live tarot-data.js changed since this manifest was recorded")
    seen_hashes = set()
    for entry in entries:
        cid = entry["id"]
        for key in ["character", "series"]:
            if entry.get(key) is not None and not isinstance(entry[key], str):
                issues.append(f"ID {cid}: invalid {key} metadata")
        urls = entry.get("referenceUrls", [])
        if not isinstance(urls, list) or any(not isinstance(url, str) or not url.startswith("https://") for url in urls):
            issues.append(f"ID {cid}: reference URLs must be HTTPS links")
        expected_path = relative(candidates / f"card-{cid:02d}.webp")
        if current[cid]["name"] != entry["name"] or current[cid]["nameEn"] != entry["nameEn"]:
            issues.append(f"ID {cid}: card identity differs from live data")
        expected_live = entry["candidateImage"] if applied else entry["originalImage"]
        if current[cid]["image"] != expected_live:
            issues.append(f"ID {cid}: unexpected live image mapping")
        original = ROOT / entry["originalImage"]
        if not original.is_file() or digest(original) != entry["originalSha256"]:
            issues.append(f"ID {cid}: original image missing or changed")
        if entry["expectedImage"] != expected_path:
            issues.append(f"ID {cid}: unexpected candidate filename")
        if entry["status"] == "pending":
            if any(entry[key] is not None for key in ["candidateImage", "sourcePath", "sourceSha256", "sourceDimensions", "dimensions", "sha256"]):
                issues.append(f"ID {cid}: pending card incorrectly claims an imported file")
            if require_complete:
                issues.append(f"ID {cid}: candidate not generated/imported yet")
            continue
        if entry["status"] != "candidate_ready" or entry["candidateImage"] != expected_path:
            issues.append(f"ID {cid}: invalid candidate status or mapping")
            continue
        candidate = ROOT / expected_path
        source = (ROOT / (entry["sourcePath"] or "")).resolve()
        if not source.is_relative_to((folder / "sources").resolve()):
            issues.append(f"ID {cid}: source must be under this deck's sources folder")
        if source.is_file() and digest(source) != entry["sourceSha256"]:
            issues.append(f"ID {cid}: source missing or changed")
        elif not source.is_file() and require_sources:
            issues.append(f"ID {cid}: source missing or changed")
        elif not source.is_file() and not re.fullmatch(r'[0-9a-f]{64}', str(entry.get('sourceSha256', ''))):
            issues.append(f'ID {cid}: source SHA256 provenance not recorded')
        if not candidate.is_file():
            issues.append(f"ID {cid}: candidate image missing")
            continue
        if digest(candidate) != entry["sha256"] or image_info(candidate) != entry["dimensions"]:
            issues.append(f"ID {cid}: candidate hash or dimensions differ")
        profile = manifest.get('encodingProfile')
        if profile and (entry.get('encoding') != profile or entry['dimensions']['width'] > profile['maxWidth'] or entry['dimensions']['height'] > profile['maxHeight']):
            issues.append(f'ID {cid}: candidate differs from the selected encoding profile')
        prompt_path = entry.get('promptPath')
        if prompt_path:
            prompt_file = (ROOT / prompt_path).resolve()
            if not prompt_file.is_relative_to((folder / 'prompts').resolve()) or not prompt_file.is_file() or digest(prompt_file) != entry.get('promptSha256'):
                issues.append(f'ID {cid}: generation prompt provenance missing or changed')
        elif require_complete:
            issues.append(f'ID {cid}: generation prompt provenance not recorded')
        if entry["sha256"] in seen_hashes:
            issues.append(f"ID {cid}: duplicates another candidate image")
        seen_hashes.add(entry["sha256"])
    return issues


def import_image(deck, manifest, cid, source_arg, prevalidated=False):
    folder, candidates = deck_paths(deck)
    if manifest.get("application", {}).get("state") == "applied":
        raise ValueError("This deck was applied; create a new version for further artwork")
    issues = [] if prevalidated else validate(deck, manifest)
    if issues:
        raise ValueError("\n".join(issues))
    entry = next((c for c in manifest["cards"] if c["id"] == cid), None)
    if entry is None:
        raise ValueError("Card ID must be between 0 and 77")
    source = Path(source_arg).resolve()
    if not source.is_relative_to((folder / "sources").resolve()) or not source.is_file():
        raise ValueError("Source must be an existing generated image in this deck's sources folder")
    source_hash = digest(source)
    if source_hash in {c["originalSha256"] for c in manifest["cards"]}:
        raise ValueError("Existing card artwork cannot be imported as newly generated artwork")
    if entry["status"] == "candidate_ready":
        if entry["sourceSha256"] == source_hash:
            return
        raise ValueError("A candidate already exists for this ID; create a versioned deck instead of overwriting")
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        if image.width < 320 or image.height < 480:
            raise ValueError("Generated source is too small (minimum 320×480)")
        if abs(image.width / image.height - 2 / 3) > 0.04:
            raise ValueError("Expected a portrait illustration approximately 2:3; refusing to crop or distort")
        source_dimensions = {"width": image.width, "height": image.height}
        profile = manifest.get('encodingProfile', LEGACY_ENCODING_PROFILE)
        image.thumbnail((profile['maxWidth'], profile['maxHeight']), Image.Resampling.LANCZOS)
        candidates.mkdir(parents=True, exist_ok=True)
        destination = ROOT / entry["expectedImage"]
        if destination.exists():
            raise ValueError(f"Untracked destination already exists: {entry['expectedImage']}")
        image.save(destination, 'WEBP', quality=profile['quality'], method=profile['method'])
    entry.update({
        "candidateImage": relative(destination), "sourcePath": relative(source),
        "sourceSha256": source_hash, "sourceDimensions": source_dimensions,
        "status": "candidate_ready", "dimensions": image_info(destination),
        "sha256": digest(destination), "importedAt": now(),
        "encoding": dict(profile),
    })
    save_manifest(folder, manifest)


def reencode_candidates(deck, manifest):
    """Explicit, locked profile migration; preserve raw art and archive old derivatives."""
    issues = validate(deck, manifest)
    if issues:
        raise ValueError('\n'.join(issues))
    if manifest.get('application', {}).get('state') == 'applied':
        raise ValueError('Reencode the candidate deck before applying it')
    folder, _ = deck_paths(deck)
    archive = folder / 'encoding-study' / ('pre-640-q84-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
    archive.mkdir(parents=True, exist_ok=False)
    prepared, before_bytes, after_bytes = [], 0, 0
    profile = dict(ENCODING_PROFILE)
    for entry in manifest['cards']:
        if entry['status'] != 'candidate_ready':
            continue
        source, target = ROOT / entry['sourcePath'], ROOT / entry['candidateImage']
        shutil.copy2(target, archive / target.name)
        before_bytes += target.stat().st_size
        temporary = target.with_name(target.name + '.reencode.tmp')
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert('RGB')
            image.thumbnail((profile['maxWidth'], profile['maxHeight']), Image.Resampling.LANCZOS)
            image.save(temporary, 'WEBP', quality=profile['quality'], method=profile['method'])
        prepared.append((entry, temporary, target, image_info(temporary), digest(temporary)))
        after_bytes += temporary.stat().st_size
    for entry, temporary, target, dimensions, sha in prepared:
        temporary.replace(target)
        entry.update({'dimensions': dimensions, 'sha256': sha, 'encoding': profile})
    report = {'changedAt': now(), 'encodingProfile': profile, 'candidateCount': len(prepared),
              'beforeTotalBytes': before_bytes, 'afterTotalBytes': after_bytes,
              'savedBytes': before_bytes - after_bytes, 'previousDerivatives': relative(archive)}
    manifest['encodingProfile'] = profile
    manifest.setdefault('encodingHistory', []).append(report)
    save_manifest(folder, manifest)
    (archive / 'migration.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False))


def sync_generated(deck, manifest):
    """Import only finished, traceable artist records; raw file presence is insufficient."""
    folder, _ = deck_paths(deck)
    issues = validate(deck, manifest)
    if issues:
        raise ValueError('\n'.join(issues))
    entries = {card['id']: card for card in manifest['cards']}
    imported, errors, deferred = [], [], []
    seen_ids = set()
    for prompt_path in sorted((folder / 'prompts').glob('*.json')):
        try:
            record = json.loads(prompt_path.read_text(encoding='utf-8'))
            if record.get('status') != 'generated_candidate':
                deferred.append(relative(prompt_path))
                continue
            cid = record.get('card_id')
            if cid not in entries or cid in seen_ids:
                raise ValueError('Unknown or duplicated generated card ID')
            seen_ids.add(cid)
            entry = entries[cid]
            expected, observed = record.get('expected_suit_count'), record.get('observed_suit_count')
            if isinstance(expected, int) and isinstance(observed, int) and expected != observed:
                raise ValueError('Artist-observed suit count differs from expected count')
            extra_fields = {
                target: record[source_key] for source_key, target in {
                    'referenceHostType': 'referenceHostType', 'referenceVersion': 'referenceVersion',
                    'expected_suit_count': 'expectedSuitCount', 'observed_suit_count': 'observedSuitCount',
                }.items() if source_key in record
            }
            if entry['status'] == 'candidate_ready' and entry.get('promptSha256') == digest(prompt_path):
                if any(entry.get(key) != value for key, value in extra_fields.items()):
                    entry.update(extra_fields)
                    save_manifest(folder, manifest)
                continue
            if record.get('card_name') != entry['name']:
                raise ValueError('Generated card name does not match the live card ID')
            if record.get('tool') != 'image_gen.imagegen':
                raise ValueError('Expected built-in image_gen.imagegen provenance')
            for key in ['prompt', 'character', 'series', 'workspace_source', 'sha256', 'visual_review']:
                if not isinstance(record.get(key), str) or not record[key].strip():
                    raise ValueError(f'Missing finished generation record field: {key}')
            urls = record.get('reference_urls', [])
            if not urls or any(not isinstance(url, str) or not url.startswith('https://') for url in urls):
                raise ValueError('Finished record must identify checked HTTPS character references')
            source = Path(record['workspace_source'])
            source = source.resolve() if source.is_absolute() else (ROOT / source).resolve()
            if not source.is_relative_to((folder / 'sources').resolve()) or not source.is_file():
                raise ValueError('Generated source is missing or outside this deck')
            if digest(source) != record['sha256']:
                raise ValueError('Generated source SHA256 differs from artist record')
            reference_paths = record.get('reference_paths', [])
            if not reference_paths:
                raise ValueError('Finished record must identify the actual character reference files')
            has_character_reference = False
            for reference in reference_paths:
                reference_path = Path(reference)
                if not reference_path.is_absolute():
                    reference_path = folder / reference_path
                reference_path = reference_path.resolve()
                allowed_reference = reference_path.is_relative_to((folder / 'references').resolve())
                allowed_style_reference = reference_path.is_relative_to((folder / 'sources').resolve())
                has_character_reference = has_character_reference or allowed_reference
                if not (allowed_reference or allowed_style_reference) or not reference_path.is_file():
                    raise ValueError(f'Character reference file missing or outside this deck: {reference}')
            if not has_character_reference:
                raise ValueError('At least one character reference must come from the checked references folder')
            was_pending = entry['status'] == 'pending'
            import_image(deck, manifest, cid, str(source), prevalidated=True)
            entry.update({
                'character': entry.get('character') or record.get('character_display') or record['character'],
                'series': entry.get('series') or record.get('series_display') or record['series'],
                'referenceUrls': list(dict.fromkeys(entry.get('referenceUrls', []) + urls)),
                'promptPath': relative(prompt_path), 'promptSha256': digest(prompt_path),
                'generationTool': record['tool'], 'visualReview': record['visual_review'],
            })
            entry.update(extra_fields)
            save_manifest(folder, manifest)
            if was_pending:
                imported.append(cid)
        except (ValueError, OSError, KeyError, json.JSONDecodeError) as error:
            errors.append({'prompt': relative(prompt_path), 'error': str(error)})
    queue = {'deck': deck, 'checkedAt': now(), 'importedIds': imported,
             'deferredPrompts': deferred, 'errors': errors,
             'ready': sum(c['status'] == 'candidate_ready' for c in manifest['cards']),
             'expectedCount': EXPECTED_COUNT}
    temporary = folder / 'queue-status.json.tmp'
    temporary.write_text(json.dumps(queue, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(folder / 'queue-status.json')
    return queue


def render_preview(deck, manifest):
    folder, _ = deck_paths(deck)
    ready = sum(c['status'] == 'candidate_ready' for c in manifest['cards'])
    applied = manifest.get('application', {}).get('state') == 'applied'
    title = manifest['label'].replace('候選牌面', '完整牌面') if applied else manifest['label']
    def link(path):
        return '../../../' + html.escape(path, quote=True)
    parts = []
    for card in manifest['cards']:
        complete = card['status'] == 'candidate_ready'
        candidate_url = (link(card['candidateImage']) + '?v=' + card['sha256'][:12]) if complete else None
        character, series = card.get('character'), card.get('series')
        metadata = (f'<p class="character">{html.escape(character)}'
                    + (f'<br><span>{html.escape(series)}</span>' if series else '') + '</p>') if character else '<p class="character">角色與牌面製作中</p>'
        candidate = (f'<a class="art-link" href="{candidate_url}" target="_blank" rel="noopener" aria-label="放大{html.escape(card["name"], quote=True)}新牌面"><img src="{candidate_url}" alt="{html.escape(card["name"], quote=True)}新牌面" loading="lazy" decoding="async"></a>'
                     if complete else '<div class="pending">待製作</div>')
        refs = card.get('referenceUrls', [])
        reference_note = '第三方典藏來源，並非官方網站。' if 'third_party' in str(card.get('referenceHostType', '')) else ''
        reference_links = ('<details class="references"><summary>角色參考來源</summary><p>' + reference_note + '、'.join(
            f'<a href="{html.escape(url, quote=True)}" target="_blank" rel="noopener noreferrer">參考 {i + 1}</a>'
            for i, url in enumerate(refs)) + '</p></details>') if refs else ''
        search = html.escape(' '.join(str(x) for x in [card['name'], card['nameEn'], character or '', series or '']).lower(), quote=True)
        caption = ('新牌面' if applied else '新牌面候選') if complete else '待製作'
        parts.append(f'<article class="card" data-ready="{str(complete).lower()}" data-search="{search}"><h2>{html.escape(card["name"])}</h2>{metadata}<div class="pair"><figure class="original"><img src="{link(card["originalImage"])}" alt="{html.escape(card["name"], quote=True)}更新前牌面" loading="lazy" decoding="async"><figcaption>更新前牌面</figcaption></figure><figure>{candidate}<figcaption>{caption}</figcaption></figure></div>{reference_links}</article>')
    state = '全套 78 張牌面已套用，可使用下方搜尋與新舊對照瀏覽。' if applied else '正式網站仍使用原有牌面；這裡供整套新牌面檢查。'
    template = '''<!doctype html><html lang="zh-TW"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>@@TITLE@@</title><style>
*{box-sizing:border-box}[hidden]{display:none!important}body{margin:0;padding:24px 16px;background:#100c20;color:#f3eafd;font:16px/1.6 system-ui,sans-serif}main{max-width:1280px;margin:auto}h1{font-size:clamp(24px,6vw,36px);line-height:1.4}h2{font-size:20px;line-height:1.5;margin:0 0 8px}.notice{padding:16px;border:1px solid #8e72a6;border-radius:12px;background:#251a36}.controls{margin:20px 0;padding:16px;border:1px solid #6d527f;border-radius:12px;background:#1b122b}.view-controls,.filter-controls{display:flex;gap:10px;flex-wrap:wrap}.filter-controls{margin-top:12px}button,input,select{font:inherit;min-height:48px;border:1px solid #a18ab4;border-radius:8px;padding:10px 12px;color:#f3eafd;background:#261a38}button{flex:1;cursor:pointer}button[aria-pressed="true"]{background:#e9ce8a;color:#21162c;border-color:#e9ce8a;font-weight:700}input{flex:1;min-width:150px;width:100%}select{min-width:130px}button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #e9ce8a;outline-offset:3px}.filter-label{display:block;margin-bottom:6px}.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;align-items:start}.card{padding:12px;min-width:0;border:1px solid #5b426e;border-radius:14px;background:#1c132b}.character{margin:0 0 12px;color:#e9ce8a;overflow-wrap:anywhere}.character span{color:#d4c4e2}.pair{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}figure{margin:0;min-width:0}img,.pending{display:block;width:100%;aspect-ratio:2/3;object-fit:contain;background:#21182f;border-radius:10px}.pending{display:grid;place-items:center;color:#cfbfdf;border:1px dashed #8e72a6;text-align:center}.original{display:none}figcaption{font-size:16px;margin-top:8px}a{color:#e9ce8a}.art-link{display:block}.references{margin-top:12px;color:#d6c9e2}.references summary{cursor:pointer}p{overflow-wrap:anywhere}.view-compare .cards{grid-template-columns:repeat(auto-fill,minmax(440px,1fr))}.view-compare .original{display:block}.view-compare .pair{grid-template-columns:repeat(2,minmax(0,1fr))}.count{margin-bottom:0;color:#d9cce4}footer{margin-top:28px}.empty{padding:20px;border:1px dashed #8e72a6;border-radius:12px}
@media(max-width:600px){.cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.card{padding:8px}h2{font-size:18px}.view-compare .cards,.view-compare .pair{grid-template-columns:minmax(0,1fr)}.view-compare .card{padding:12px}.controls{padding:12px}button{padding:10px 8px}.character{line-height:1.5}.references summary{overflow-wrap:anywhere}}
</style></head><body class="view-new"><main><h1>@@TITLE@@</h1><p class="notice"><strong>候選已完成：@@READY@@ / @@TOTAL@@ 張</strong><br>@@STATE@@<br>新牌面為 AI 生成的角色塔羅插畫，來源連結只供角色外觀辨識。</p><section class="controls" aria-label="牌面瀏覽設定"><div class="view-controls" role="group" aria-label="顯示方式"><button type="button" data-view="new" aria-pressed="true">只看新牌面</button><button type="button" data-view="compare" aria-pressed="false">新舊對照</button></div><div class="filter-controls"><input id="search" type="search" placeholder="搜尋牌名、角色或系列" aria-label="搜尋牌名、角色或系列"><select id="status" aria-label="完成狀態"><option value="all">全部牌面</option><option value="ready">已完成候選</option><option value="pending">待製作</option></select></div><p class="count" id="visibleCount" role="status"></p></section><div class="cards" id="cards">@@CARDS@@</div><p class="empty" id="empty" hidden>找不到符合條件的牌面。</p><footer><a href="../../../index.html">返回正式版前台</a></footer></main><script>
const cards=Array.from(document.querySelectorAll('.card'));const search=document.getElementById('search');const status=document.getElementById('status');function filter(){const q=search.value.trim().toLowerCase();let count=0;for(const card of cards){const visible=card.dataset.search.includes(q)&&(status.value==='all'||(status.value==='ready')===(card.dataset.ready==='true'));card.hidden=!visible;if(visible)count++;}document.getElementById('visibleCount').textContent=`顯示 ${count} / ${cards.length} 張`;document.getElementById('empty').hidden=count!==0;}search.addEventListener('input',filter);status.addEventListener('change',filter);document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{document.body.classList.toggle('view-compare',button.dataset.view==='compare');document.querySelectorAll('[data-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));filter();
</script></body></html>'''
    document = (template.replace('@@TITLE@@', html.escape(title))
                .replace('@@READY@@', str(ready)).replace('@@TOTAL@@', str(EXPECTED_COUNT))
                .replace('@@STATE@@', state).replace('@@CARDS@@', ''.join(parts)))
    if applied:
        document = document.replace('候選已完成：', '已套用牌面：').replace('已完成候選', '已完成牌面').replace('返回正式版前台', '返回抽牌頁面')
    (folder / 'preview.html').write_text(document + '\n', encoding='utf-8')


def finalize_deck_readme(deck, manifest):
    if deck != 'dq-heroes-v1' or manifest.get('application', {}).get('state') != 'applied':
        return
    folder, _ = deck_paths(deck)
    total_bytes = sum((ROOT / card['candidateImage']).stat().st_size for card in manifest['cards'])
    text = f'''# 勇者鬥惡龍・完整角色塔羅牌組

**78 / 78 張已製作完成並套用。** 正式映射使用 `images/cards/dq-heroes-v1/card-00.webp` 至 `card-77.webp`；牌名、正逆位牌義與其他原有資料保留。

全部 WebP 採 640×960 上限、Q84、method 6，等比例縮小。實際 runtime 圖檔總量 **{total_bytes:,} bytes（{total_bytes / 1024 ** 2:.2f} MiB）**。

## 瀏覽與出處

[完整牌面、搜尋與新舊對照](preview.html)

- `manifest.json`：78 張 ID 對照、圖檔與來源 SHA256、角色／系列、編碼設定及套用紀錄。
- `prompts/`：完整生成 prompt、來源參考、產圖工具與逐張視覺檢查；失敗或淘汰嘗試保留各自狀態。
- `references/*.json`：角色參考來源索引；第三方典藏來源另記明來源類型。
- `visual-review.json`：父代理的品質檢查紀錄。
- `character-plan.json`：創作配對規劃，實際採用內容以最終 prompt 與 manifest 為準。
- `encoding-study/report.json`：編碼比較的實測大小。

新牌面是 AI 生成的角色塔羅插畫，來源連結供角色外觀辨識。原始 PNG、參考圖、舊 manga 測試版及編碼實驗二進位留在本機；Git 發布範圍見 `deployment-allowlist.json`。

## 驗證

新 checkout 可驗證已發布的 WebP／prompt 與完整映射：

```sh
python3 scripts/card_deck.py --deck dq-heroes-v1 check --release --require-complete
```

保有原始 PNG 的製作環境可執行嚴格來源 hash 檢查：

```sh
python3 scripts/card_deck.py --deck dq-heroes-v1 check --require-complete
```

## 保留原始資料

`tarot-data.before-apply.js` 保存套用前完整資料；原有牌面檔案仍保留。`manifest.application` 記錄原映射備份與套用後資料 hash，`encodingHistory` 記錄明確的編碼遷移。後續新版本可用工具的 `init`、`import`／`sync`、`check`、`preview` 與 `apply` 維護。
'''
    temporary = folder / 'README.md.tmp'
    temporary.write_text(text, encoding='utf-8')
    temporary.replace(folder / 'README.md')


def apply_deck(deck, manifest):
    issues = validate(deck, manifest, require_complete=True)
    if issues:
        raise ValueError("Refusing to apply: complete 78-card deck required.\n" + "\n".join(issues))
    if manifest.get("application", {}).get("state") == "applied":
        print("Deck is already applied; mapping verified")
        return
    text, cards = read_cards()
    entries = {c["id"]: c for c in manifest["cards"]}
    matches = list(re.finditer(r'("image"\s*:\s*")([^"\\]*)(")', text))
    if len(matches) != EXPECTED_COUNT:
        raise ValueError("Expected exactly 78 plain image properties; refusing unsafe text replacement")
    updated = text
    for card, match in reversed(list(zip(cards, matches))):
        if match.group(2) != card["image"]:
            raise ValueError("Image property order differs from card records")
        updated = updated[:match.start(2)] + entries[card["id"]]["candidateImage"] + updated[match.end(2):]
    check = json.loads(updated[updated.index('['):updated.rindex(']') + 1])
    expected = [dict(card, image=entries[card['id']]['candidateImage']) for card in cards]
    if check != expected:
        raise ValueError("Unexpected data change; refusing application")
    folder, _ = deck_paths(deck)
    backup = folder / 'tarot-data.before-apply.js'
    if backup.exists():
        raise ValueError("Backup already exists; refusing to overwrite original evidence")
    backup.write_text(text, encoding='utf-8')
    DATA.write_text(updated, encoding='utf-8')
    manifest['application'] = {'state': 'applied', 'appliedAt': now(), 'backup': relative(backup), 'dataSha256': digest(DATA)}
    save_manifest(folder, manifest)
    finalize_deck_readme(deck, manifest)
    print("Applied 78 image mappings. Existing artwork and original data backup preserved.")
    print("Review the result and bump the Service Worker cache before deployment.")


def watch_generated(deck, interval):
    """One writer, bounded polling sleeps, and no implicit live-deck application."""
    if not 1 <= interval <= 60:
        raise ValueError('Watch interval must be between 1 and 60 seconds')
    folder, _ = deck_paths(deck)
    folder.mkdir(parents=True, exist_ok=True)
    previous = None
    while True:
        with (folder / '.integration.lock').open('a') as lock:
            try:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                time.sleep(interval)
                continue
            manifest = initialize(deck)
            queue = sync_generated(deck, manifest)
            render_preview(deck, manifest)
            summary = (queue['ready'], json.dumps(queue['errors'], sort_keys=True))
            if summary != previous or queue['importedIds']:
                print(json.dumps(queue, ensure_ascii=False), flush=True)
                previous = summary
            if queue['ready'] == EXPECTED_COUNT and not queue['errors']:
                issues = validate(deck, manifest, require_complete=True)
                if issues:
                    raise ValueError('\n'.join(issues))
                print('All 78 candidates complete and checked; live deck not applied. Await parent-agent final QA.', flush=True)
                return 0
        time.sleep(interval)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--deck', default='manga-adventure-v1')
    commands = parser.add_subparsers(dest='command', required=True)
    init = commands.add_parser('init')
    init.add_argument('--label')
    init.add_argument('--sample-ids', type=int, nargs='+')
    imp = commands.add_parser('import')
    imp.add_argument('id', type=int)
    imp.add_argument('source')
    annotate = commands.add_parser('annotate')
    annotate.add_argument('id', type=int)
    annotate.add_argument('--character', required=True)
    annotate.add_argument('--series', required=True)
    annotate.add_argument('--reference-url', action='append', default=[])
    check = commands.add_parser('check')
    check.add_argument('--require-complete', action='store_true')
    check.add_argument('--release', action='store_true', help='Validate distributable WebP/prompt hashes without requiring local original PNG files')
    commands.add_parser('preview')
    commands.add_parser('sync')
    commands.add_parser('reencode')
    watch = commands.add_parser('watch')
    watch.add_argument('--interval', type=int, default=20)
    commands.add_parser('apply')
    args = parser.parse_args()
    lock = None
    try:
        if args.command == 'watch':
            return watch_generated(args.deck, args.interval)
        folder, _ = deck_paths(args.deck)
        folder.mkdir(parents=True, exist_ok=True)
        lock = (folder / '.integration.lock').open('a')
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ValueError('Another deck integration write is in progress; retry shortly')
        manifest = initialize(args.deck, getattr(args, 'label', None), getattr(args, 'sample_ids', None))
        folder, _ = deck_paths(args.deck)
        if args.command == 'import':
            import_image(args.deck, manifest, args.id, args.source)
        elif args.command == 'annotate':
            entry = next((c for c in manifest['cards'] if c['id'] == args.id), None)
            if entry is None:
                raise ValueError('Card ID must be between 0 and 77')
            if any(not url.startswith('https://') for url in args.reference_url):
                raise ValueError('Reference URLs must be HTTPS links')
            entry.update({'character': args.character, 'series': args.series,
                          'referenceUrls': list(dict.fromkeys(args.reference_url))})
            save_manifest(folder, manifest)
        elif args.command == 'check':
            issues = validate(args.deck, manifest, args.require_complete, require_sources=not args.release)
            if issues:
                raise ValueError('\n'.join(issues))
        elif args.command == 'sync':
            queue = sync_generated(args.deck, manifest)
            render_preview(args.deck, manifest)
            print(json.dumps(queue, ensure_ascii=False))
            return 1 if queue['errors'] else 0
        elif args.command == 'reencode':
            reencode_candidates(args.deck, manifest)
        elif args.command == 'apply':
            apply_deck(args.deck, manifest)
        render_preview(args.deck, manifest)
        ready = sum(c['status'] == 'candidate_ready' for c in manifest['cards'])
        print(json.dumps({'deck': args.deck, 'ready': ready, 'pending': EXPECTED_COUNT-ready,
                          'applied': manifest['application']['state'] == 'applied',
                          'preview': relative(folder/'preview.html')}, ensure_ascii=False))
    except (ValueError, OSError, KeyError, json.JSONDecodeError) as error:
        print(str(error), file=sys.stderr)
        return 1
    finally:
        if lock is not None:
            lock.close()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
