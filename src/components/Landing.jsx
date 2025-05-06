import { useEffect, useState } from "react";

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export default function Landing() {
  const [title, setTitle] = useState("");
  const [text, setText]   = useState("");
  const [tasks, setTasks] = useState([]);

  /* ─ GET ─ */
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(r => r.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

  /* ─ POST ─ */
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text })
    });
    const newT = await res.json();
    setTasks(prev => [newT, ...prev]);  // prepend newest
    setTitle(""); setText("");
  };

  /* ─ DELETE ─ */
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <section className="bg-gray-200 flex">
      {/*  left-hand form  */}
      <div className="h-screen w-1/4 bg-gray-200">
        <form onSubmit={addTask} className="flex flex-col items-center pt-10">
          <input
            className="bg-white w-4/5 h-10 rounded-md p-2 mb-4"
            placeholder="Enter the Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="bg-white w-4/5 h-40 rounded-md p-2 mb-4 resize-none"
            placeholder="Content"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button
            type="submit"
            className="w-3/5 h-10 bg-white rounded-md hover:bg-gray-100"
          >
            Add Note
          </button>
        </form>
      </div>

      {/*  right-hand notes list  */}
      <div className="h-screen w-3/4 overflow-y-auto">
        {chunk(tasks, 2).map((row, idx) => (
          <div key={idx} className="flex flex-row gap-5 p-5">
            {row.map(t => (
              <div
                key={t.id}
                className="w-1/3 border-2 p-5 rounded bg-white shadow-sm relative"
              >
                {/* delete button */}
                <button
                  onClick={() => deleteTask(t.id)}
                  className="absolute top-2 right-3 text-xl font-bold hover:text-red-500"
                >
                  ×
                </button>

                {/* note content */}
                <h1 className="text-lg font-semibold mb-2 break-words">
                  {t.title}
                </h1>
                <p className="whitespace-pre-wrap break-words">{t.text}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
