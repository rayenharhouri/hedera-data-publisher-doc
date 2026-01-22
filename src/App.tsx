import React from "react";

const navItems = [
  { id: "overview", label: "Overview" },
  { id: "quickstart", label: "Quickstart" },
  { id: "cli", label: "CLI" },
  { id: "library", label: "Library API" },
  { id: "schema", label: "Message Schema" },
  { id: "storage", label: "Storage" },
  { id: "verify", label: "Verification" },
  { id: "security", label: "Security" },
  { id: "faq", label: "FAQ" }
];

export default function App(): JSX.Element {
  return (
    <div className="page">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">HDP</div>
          <div>
            <div className="brand-title">hedera-data-publisher</div>
            <div className="brand-sub">Hedera dataset provenance</div>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="chip">Version 0.1.0</div>
          <div className="links">
            <a href="https://github.com/example/hedera-data-publisher" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/hedera-data-publisher" target="_blank" rel="noreferrer">
              npm
            </a>
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="hero" id="overview">
          <div className="eyebrow">Documentation</div>
          <h1>Publish dataset provenance to Hedera without storing raw data on-chain.</h1>
          <p>
            hedera-data-publisher ingests CSV files or Postgres queries, creates a deterministic
            snapshot, hashes it, stores it off-chain, and publishes compact metadata to Hedera HCS.
          </p>
          <div className="hero-actions">
            <a className="button" href="#quickstart">Get started</a>
            <a className="button ghost" href="#schema">View schema</a>
          </div>
        </header>

        <section className="card" id="quickstart" style={{ "--i": 1 } as React.CSSProperties}>
          <h2>Quickstart</h2>
          <p>Install the package and initialize a config or publish directly.</p>
          <div className="code-grid">
            <div>
              <div className="label">Install</div>
              <pre><code>{`git clone https://github.com/rayenharhouri/hedera-data-publisher.git
cd hedera-data-publisher
npm install`}</code></pre>
            </div>
            <div>
              <div className="label">Create a topic</div>
              <pre><code>{`export HEDERA_OPERATOR_KEY="<private-key>"
node dist/cli.cjs init --network testnet \\
  --create-topic --operator-id 0.0.1234`}</code></pre>
            </div>
          </div>
        </section>

        <section className="card" id="cli" style={{ "--i": 2 } as React.CSSProperties}>
          <h2>CLI usage</h2>
          <p>The CLI is designed for quick publishing and verification workflows.</p>
          <div className="callout">
            <strong>Tip:</strong> Use <code>--mock</code> to skip Hedera submissions during local testing.
          </div>
          <div className="stack">
            <div>
              <div className="label">Publish CSV</div>
              <pre><code>{`node dist/cli.cjs publish csv ./examples/sample.csv \\
  --topic 0.0.1234 \\
  --operator-id 0.0.1234 \\
  --network testnet`}</code></pre>
            </div>
            <div>
              <div className="label">Publish SQL</div>
              <pre><code>{`node dist/cli.cjs publish sql \\
  --conn "postgres://user:pass@localhost:5432/db" \\
  --query "select * from users" \\
  --topic 0.0.1234`}</code></pre>
            </div>
            <div>
              <div className="label">Verify</div>
              <pre><code>{`node dist/cli.cjs verify \\
  --dataset-id <datasetId> \\
  --version <version> \\
  --topic 0.0.1234`}</code></pre>
            </div>
            <div>
              <div className="label">History</div>
              <pre><code>{`node dist/cli.cjs history \\
  --dataset-id <datasetId> \\
  --topic 0.0.1234`}</code></pre>
            </div>
          </div>
        </section>

        <section className="card" id="library" style={{ "--i": 3 } as React.CSSProperties}>
          <h2>Library API</h2>
          <p>Use the library directly for programmatic workflows.</p>
          <pre><code>{`import { publishCSV, verifyPublishedSnapshot } from "hedera-data-publisher";

const result = await publishCSV("./data/example.csv", {
  hedera: {
    topicId: "0.0.1234",
    operatorId: "0.0.1234",
    operatorKey: process.env.HEDERA_OPERATOR_KEY
  },
  storage: { type: "local" }
});

const verified = await verifyPublishedSnapshot(
  {
    datasetId: result.datasetId,
    version: result.version,
    topicId: result.topicId
  },
  { network: "testnet" }
);`}</code></pre>
        </section>

        <section className="card" id="schema" style={{ "--i": 4 } as React.CSSProperties}>
          <h2>HCS message schema</h2>
          <p>Messages are JSON with stable key ordering to ensure deterministic hashing.</p>
          <pre><code>{`{
  "v": 1,
  "event": "DATASET_PUBLISHED",
  "datasetId": "uuid-v4",
  "version": "2024-01-01T00:00:00.000Z",
  "source": { "type": "CSV" },
  "hash": { "algo": "SHA-256", "value": "..." },
  "schemaHash": "...",
  "storageRef": "file:///...",
  "rows": 123,
  "columns": 7,
  "publisher": "0.0.1234",
  "ts": 1704067200
}`}</code></pre>
        </section>

        <section className="card" id="storage" style={{ "--i": 5 } as React.CSSProperties}>
          <h2>Storage</h2>
          <div className="grid">
            <div className="panel">
              <h3>Local (default)</h3>
              <p>Snapshots are copied to:</p>
              <code>.hedera-data-publisher/snapshots/&lt;datasetId&gt;/&lt;version&gt;.csv</code>
            </div>
            <div className="panel">
              <h3>None</h3>
              <p>Use the original file path as the storage reference.</p>
            </div>
            <div className="panel">
              <h3>S3</h3>
              <p>Provider stub included for future implementation.</p>
            </div>
          </div>
        </section>

        <section className="card" id="verify" style={{ "--i": 6 } as React.CSSProperties}>
          <h2>Verification</h2>
          <p>
            Verification uses the mirror node API, re-downloads or reads the snapshot referenced by
            <code> storageRef</code>, and recomputes the hash.
          </p>
          <div className="callout">
            <strong>Success criteria:</strong> the computed hash matches the on-chain hash.
          </div>
        </section>

        <section className="card" id="security" style={{ "--i": 7 } as React.CSSProperties}>
          <h2>Security &amp; privacy</h2>
          <ul>
            <li>Raw dataset bytes never go on-chain.</li>
            <li>Only hashes and metadata are published.</li>
            <li>Keep operator keys in environment variables.</li>
          </ul>
        </section>

        <section className="card" id="faq" style={{ "--i": 8 } as React.CSSProperties}>
          <h2>FAQ</h2>
          <div className="qa">
            <h3>Do I need to create a topic first?</h3>
            <p>Yes. Topics cost HBAR to create, so it is an explicit step.</p>
          </div>
          <div className="qa">
            <h3>Can I run locally without Hedera?</h3>
            <p>Yes. Use <code>--mock</code> to skip HCS submissions.</p>
          </div>
          <div className="qa">
            <h3>How do I verify an older version?</h3>
            <p>Pass the <code>version</code> explicitly to the verify command.</p>
          </div>
        </section>

        <footer className="footer">
          <span>Built for fast, verifiable dataset publishing on Hedera.</span>
        </footer>
      </main>
    </div>
  );
}
