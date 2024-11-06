import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Natural "mo:base/Nat";
import Hash "mo:base/Hash";


actor {

  // type definitions
  private type TodoId = Nat; // id
  private type Todo = {
    id: TodoId;
    title: Text;
    completed: Bool;
    createdAt: Int;
    owner: Principal;
  };

  // state
  private stable var nextTodoId : TodoId = 0;
  private var todos = HashMap.HashMap<TodoId, Todo>(0, Natural.equal, Hash.hash);

  // functions
  // Create todo 
  public shared(msg) func createTodo(title : Text) : async TodoId {
    let todo: Todo = {
      id = nextTodoId;
      title = title;
      completed = false;
      createdAt = Time.now();
      owner = msg.caller;
    };

    todos.put(nextTodoId, todo);
    nextTodoId += 1;

    return todo.id;
  };

  // Get a specific todo
  public shared query(msg) func getTodo(id : TodoId) : async ?Todo {
    todos.get(id);
  };


  // get all todos for the caller 
  public shared query(msg) func getMyTodos() : async [Todo] {
    let userTodos = Iter.filter<Todo>(todos.vals(), func(todo) {
      Principal.equal(todo.owner, msg.caller);
    });
    Iter.toArray(userTodos)
  };

  // update a todo
  public shared(msg) func toggleComplete(id: TodoId) : async Bool {
    switch (todos.get(id)) {
      case null {false};
      case (?todo) {
        if (Principal.equal(msg.caller, todo.owner)) {
          let updatedTodo = {
            id = todo.id;
            title = todo.title;
            completed = not todo.completed;
            createdAt = todo.createdAt;
            owner = todo.owner;
        };
        todos.put(id, updatedTodo);
        true;
      } else {
        false;
      }
    }
  }
};

// delete a todo
public shared(msg) func deleteTodo(id: TodoId) : async Bool {
  switch (todos.get(id)) {
    case null {false};
    case (?todo) {
      if (Principal.equal(msg.caller, todo.owner)) {
        todos.delete(id);
        true;
      } else {
        false;
      }
    }
  }
};




 
};
