class Todo {
	constructor (text) {
		this.text = text
		this.completed = false
		this.favorite = false
		this.created = new Date()
	}
}

const todoWrapper = document.querySelector('.todo-wrapper')
const todoInput = document.querySelector('#todo-input')
const addBtn = document.querySelector('#add-todo')

const todos = []

const todosProxy = new Proxy(todos, {
	set (target, property, value, receiver) {
		const result = Reflect.set(target, property, value, receiver)
		render()
		return result
	},
	deleteProperty (target, property) {
		const result = Reflect.deleteProperty(target, property)
		render()
		return result
	},
})

// Rendering the list of todos
const render = () => {
	// clear the screen
	const allBtns = document.querySelectorAll('.todo-wrapper button')
	allBtns.forEach(btn => btn.removeEventListener('click', deleteTodo))

	const allLabels = document.querySelectorAll('.todo-wrapper label')
	allLabels.forEach(label => label.removeEventListener('click', toggleComplete))

	todoWrapper.innerHTML = ''
	// rerender all the list items
	todosProxy.forEach((todo, index) => {
		const liDOM = document.createElement('li')
		const statusDOM = document.createElement('input')
		statusDOM.setAttribute('type', 'checkbox')
		statusDOM.setAttribute('id', `todo-${index}`)
		if (todo.completed) {
			statusDOM.setAttribute('checked', todo.completed)
		}
		const labelDOM = document.createElement('label')
		labelDOM.textContent = todo.text
		labelDOM.setAttribute('for', `todo-${index}`)
		labelDOM.addEventListener('click', () => toggleComplete(index))

		const deleteBtnDOM = document.createElement('button')
		deleteBtnDOM.innerHTML = '<i class="fa-solid fa-circle-minus"></i>'
		deleteBtnDOM.addEventListener('click', (event) => {
			console.log({ event })
			deleteTodo(index)
		})

		const editBtnDOM = document.createElement('button')
		editBtnDOM.innerHTML = '<i class="fa-solid fa-pen"></i>'
		editBtnDOM.classList.add('edit-btn')
		editBtnDOM.addEventListener('click', () => {
			editTodo(index, prompt('Edit Todo', todo.text))
		})

		liDOM.appendChild(statusDOM)
		liDOM.appendChild(labelDOM)
		liDOM.appendChild(editBtnDOM)
		liDOM.appendChild(deleteBtnDOM)

		todoWrapper.appendChild(liDOM)
	})
}

// Adding to the list of todos
const addTodo = (text) => {
	todosProxy.push(new Todo(text))
}

// Deleting an item from the list
const deleteTodo = (index) => {
	if (index > -1 && index < todosProxy.length) {
		todosProxy.splice(index, 1)
	}
}

const toggleComplete = (index) => {
	todosProxy[index].completed = !todosProxy[index].completed
}

todoInput.addEventListener('keyup', (event) => {
	if (event.key === 'Enter') {
		addTodo(todoInput.value)
		todoInput.value = ''
	}
})

addBtn.addEventListener('click', () => {
	addTodo(todoInput.value)
	todoInput.value = ''
})

const editTodo = (index, text) => {
	todosProxy[index].text = text
	render()
}