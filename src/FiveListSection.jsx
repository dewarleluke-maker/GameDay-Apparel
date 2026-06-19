export default function FiveListSection({ icon, title, hint, items, placeholder, onChange }) {
  function updateItem(index, value) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  return (
    <section className="card">
      <h2>
        {icon && <span className="icon">{icon}</span>} {title}
      </h2>
      <p className="hint">{hint}</p>
      <ol className="five-list">
        {items.map((item, index) => (
          <li key={index}>
            <input
              type="text"
              value={item}
              placeholder={placeholder}
              onChange={(e) => updateItem(index, e.target.value)}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
