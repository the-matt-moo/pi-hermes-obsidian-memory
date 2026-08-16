import json
from pathlib import Path
from graphify.build import build_from_json
from graphify.analyze import suggest_questions
from graphify.report import generate

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding='utf-8'))
detection  = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text(encoding='utf-8'))

G = build_from_json(extraction, root='M:/Github/pi-hermes-obsidian-memory', directed=False)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

labels = {
0: 'Skill Management System', 1: 'Memory Search Security', 2: 'Session Indexing',
3: 'Database Manager', 4: 'Memory And Skill Tools', 5: 'Skill Discovery Patching',
6: 'Memory Store Core', 7: 'Planning And Concepts', 8: 'Child Process',
9: 'Config System', 10: 'Extension Root Migration', 11: 'Session Anchor Search',
12: 'Standing Pin', 13: 'Review Memory Ops', 14: 'Insights And Preview',
15: 'Database Core', 16: 'Concept Taxonomy', 17: 'Failure Memory Tutorial',
18: 'Background Review', 19: 'Project Path Resolution', 20: 'Auto Consolidation',
21: 'Code Abbreviations', 22: 'Memory Policy', 23: 'Markdown Sync Migration',
24: 'Atomic Lock Coordinator', 25: 'Package Metadata', 26: 'Correction Patterns',
27: 'TSConfig', 28: 'Markdown Mutation Lock', 29: 'Atomic Lock Ops',
30: 'SQLite Native Loader', 31: 'Dev Dependencies', 32: 'Pi Commands',
33: 'Project File Map', 34: 'Check Min SDK Script', 35: 'Legacy Memory Migration',
36: 'External Dependencies', 37: 'Pi Peer Packages', 38: 'Child Process Watchdog',
39: 'NPM Scripts', 40: 'Run Tests Script', 41: 'Ensure Dev Script',
42: 'Extension Type', 43: 'Markdown Memory Type', 44: 'Pi Type',
45: 'SQLite Sessions Type', 46: 'User Concept',
}

questions = suggest_questions(G, communities, labels)
report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, 'M:/Github/pi-hermes-obsidian-memory', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}, ensure_ascii=False, indent=2), encoding='utf-8')
print('Report updated with community labels')
