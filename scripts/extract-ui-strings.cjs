// Extracts user-visible English strings from the app into backend/data/ui-strings.json.
//   node scripts/extract-ui-strings.cjs        (run from the frontend folder)
// Then in the backend:  npm run seed:translations
//
// Strings that cannot be read from the code (built with ${...}) are listed in scripts/extra-ui-strings.json.
// Sentences with the sample pet name "Milo" also get a "your pet" twin, used when no pet is selected.
// The existing output file is kept and extended, so strings already translated are never dropped.
const ts = require("typescript");
const fs = require("fs"), path = require("path");
const root = process.argv[2] || path.join(__dirname, "..", "src");
const outFile = process.argv[3] || path.join(__dirname, "..", "..", "backend", "data", "ui-strings.json");
const files = [];
(function walk(d){ for (const f of fs.readdirSync(d,{withFileTypes:true})) { const p=path.join(d,f.name); if(f.isDirectory()) walk(p); else if(/\.tsx?$/.test(f.name)) files.push(p);} })(root);
const KEYS = new Set(["title","sub","subtitle","label","text","heading","body","value","tag","desc","description","placeholder","message","name","chip","hint","cta","tagline","caption","intro","headline","note","tip","question","answer","emoji_label","button","action","msg","error","success","header","subheading","unit","empty","about","energy","grooming"]);
const out = new Map(); // text -> files
const add=(t,f)=>{ t=t.replace(/\s+/g," ").trim(); if(!t) return; if(!out.has(t)) out.set(t,new Set()); out.get(t).add(path.relative(root,f)); };
const worth = (t)=> /\p{L}/u.test(t) && !/^[\w./-]+$/.test(t) || /\s/.test(t) ;
for (const f of files) {
  if (/i18n\//.test(f)) continue;
  const src = fs.readFileSync(f,"utf8");
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, f.endsWith("x")?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  (function visit(n){
    if (ts.isJsxText(n)) { const t=n.getText().replace(/\s+/g," ").trim(); if (t && /\p{L}/u.test(t)) add(t,f); }
    else if (ts.isJsxAttribute(n) && n.initializer && ts.isStringLiteral(n.initializer) && ["placeholder","title","label","accessibilityLabel","accessibilityHint","subtitle","message"].includes(n.name.getText())) add(n.initializer.text,f);
    else if (ts.isPropertyAssignment(n) && KEYS.has(n.name.getText().replace(/["']/g,"")) ) {
      const v=n.initializer;
      if (ts.isStringLiteral(v)||ts.isNoSubstitutionTemplateLiteral(v)) { if (/\p{L}/u.test(v.text) && (/\s/.test(v.text) || /^[A-Z]/.test(v.text))) add(v.text,f); }
    }
    else if (ts.isCallExpression(n) && /Alert\.alert$/.test(n.expression.getText())) { n.arguments.slice(0,2).forEach(a=>{ if(ts.isStringLiteral(a)||ts.isNoSubstitutionTemplateLiteral(a)) add(a.text,f); }); }
    ts.forEachChild(n,visit);
  })(sf);
}
const extraFile = path.join(__dirname, "extra-ui-strings.json");
if (fs.existsSync(extraFile)) for (const t of JSON.parse(fs.readFileSync(extraFile, "utf8"))) add(t, extraFile);
const keep = new Set(out.keys());
for (const t of [...keep]) if (/\bMilo\b/.test(t)) keep.add(t.replace(/\bMilo\b/g, "your pet"));
if (fs.existsSync(outFile)) for (const t of JSON.parse(fs.readFileSync(outFile, "utf8"))) keep.add(t);
fs.writeFileSync(outFile, JSON.stringify([...keep].sort(), null, 1));
console.log("unique strings:", keep.size, "(found in code:", out.size + ")");
