"use strict";

var Panel = ReactBootstrap.Panel,
    Accordion = ReactBootstrap.Accordion;
var Button = ReactBootstrap.Button,
    Input = ReactBootstrap.Input;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Modal = ReactBootstrap.Modal;
var ListGroup = ReactBootstrap.ListGroup,
    ListGroupItem = ReactBootstrap.ListGroupItem;

// Load Items or set default Items
var items = [{ title: "Grocessary", content: "Beverage 15% Off in Kroger" }, { title: "Workout", content: "Marathon training: Week  5, Day 4" }, { title: "Buy books", content: "Find 'Learning React O'Reilly'" }],
    globalTitle = "",
    globalContent = ""; // Define global title and content

// ToDoList class. This holds all items.
var ToDoList = React.createClass({
  displayName: "ToDoList",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Accordion,
        null,
        this.props.data
      )
    );
  }
});

// Item class. This is the display for a item in ToDoList
var Item = React.createClass({
  displayName: "Item",

  remove: function remove() {
    items.splice(this.props.index, 1);
    update();
  },
  edit: function edit() {
    globalTitle = this.props.title;
    globalContent = this.props.content;
    document.getElementById("show").click();
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h4",
        { className: "text-center" },
        "What to Do?"
      ),
      React.createElement("hr", null),
      React.createElement(
        "p",
        null,
        this.props.content
      ),
      React.createElement(
        ButtonToolbar,
        null,
        React.createElement(
          Button,
          { "class": "delete", bsStyle: "danger", id: "btn-del" + this.props.index, onClick: this.remove },
          "Delete"
        ),
        React.createElement(
          Button,
          { bsStyle: "default", id: "btn-edit" + this.props.index, onClick: this.edit },
          "Edit"
        )
      )
    );
  }
});

// RecipeAdd class. This contains the Modal and Add Recipe button
var RecipeAdd = React.createClass({
  displayName: "RecipeAdd",

  getInitialState: function getInitialState() {
    return { showModal: false };
  },
  close: function close() {
    globalTitle = "";
    globalContent = "";
    this.setState({ showModal: false });
  },
  open: function open() {
    this.setState({ showModal: true });
    if (document.getElementById("title") && document.getElementById("content")) {
      $("#title").val(globalTitle);
      $("#content").val(globalContent);
      if (globalTitle != "") {
        $("#modalTitle").text("Edit What to Do");
        $("#addButton").text("Finish Edit");
      }
    } else requestAnimationFrame(this.open);
  },
  add: function add() {
    var title = document.getElementById("title").value;
    var content = document.getElementById("content").value;
    var exists = false;
    for (var i = 0; i < items.length; i++) {
      if (items[i].title === title) {
        items[i].content = content;
        exists = true;
        break;
      }
    }
    if (!exists) {
      if (title.length < 1) title = "Untitled";
      items.push({ title: title, content: content });
    }
    update();
    this.close();
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Button,
        {
          bsStyle: "primary",
          bsSize: "large",
          onClick: this.open,
          id: "show"
        },
        "Add a New Target"
      ),
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.close },
        React.createElement(
          Modal.Header,
          { closeButton: true },
          React.createElement(
            Modal.Title,
            { id: "modalTitle" },
            "Add a New Target"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(
            "form",
            null,
            React.createElement(Input, { type: "text", label: "What to Do?", placeholder: "a new target", id: "title" }),
            React.createElement(Input, { type: "textarea", label: "Content", placeholder: "notes", id: "content" })
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { onClick: this.add, bsStyle: "primary", id: "addButton" },
            "Add a New Target"
          ),
          React.createElement(
            Button,
            { onClick: this.close },
            "Close"
          )
        )
      )
    );
  }
});

// Update function to display all the items
function update() {
  localStorage.setItem("items", JSON.stringify(items));
  var rows = [];
  for (var i = 0; i < items.length; i++) {
    rows.push(React.createElement(
      Panel,
      { header: items[i].title, eventKey: i, bsStyle: "success" },
      React.createElement(Item, { title: items[i].title, content: items[i].content, index: i })
    ));
  }
  ReactDOM.render(React.createElement(ToDoList, { data: rows }), document.getElementById("container"));
}

// Render the add button (and modal)
update(); // Initially render the recipe book
ReactDOM.render(React.createElement(RecipeAdd, null), document.getElementById("button"));
