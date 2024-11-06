// import { useState } from 'react';
// import { td_app_backend } from 'declarations/td_app_backend';

// function App() {
//   const [greeting, setGreeting] = useState('');

//   function handleSubmit(event) {
//     event.preventDefault();
//     const name = event.target.elements.name.value;
//     td_app_backend.greet(name).then((greeting) => {
//       setGreeting(greeting);
//     });
//     return false;
//   }

//   return (
//     <main>
//       <img src="/logo2.svg" alt="DFINITY logo" />
//       <br />
//       <br />
//       <form action="#" onSubmit={handleSubmit}>
//         <label htmlFor="name">Enter your name: &nbsp;</label>
//         <input id="name" alt="Name" type="text" />
//         <button type="submit">Click Me!</button>
//       </form>
//       <section id="greeting">{greeting}</section>
//     </main>
//   );
// }

// export default App;
import { useState, useEffect } from "react";
import { td_app_backend } from "declarations/td_app_backend";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const result = await td_app_backend.getMyTodos();
    setTodos(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await td_app_backend.createTodo(newTodo);
    setNewTodo("");
    fetchTodos();
  };

  const toggleTodo = async (id) => {
    await td_app_backend.toggleComplete(id);
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await td_app_backend.deleteTodo(id);
    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-4 mb-4"
              >
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Add a new todo..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </form>

              <ul className="pt-4 space-y-2">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="mr-2"
                      />
                      <span
                        className={
                          todo.completed ? "line-through text-gray-500" : ""
                        }
                      >
                        {todo.title}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="px-2 py-1 text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
