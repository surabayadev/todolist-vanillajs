;(function () {
  
  var sbydevTodo = {
    STORAGE_KEY: 'sbydevTodo',

    init() {
      // 1. Prepare Database: localStorage
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        // 2. Provide Default Data
        this.generateDefaultData()
      }
      
      // 3. Render template based on Data & Bind Events
      this.renderData()

      // 4. Create Event for Create
      this.attachCreateEvent()

      // 5. ...
      var elCompleteAll = document.querySelector('#complete-all')
      var elRemoveAll = document.querySelector('#remove-all')
      
      elCompleteAll.addEventListener('click', (e) => {
        e.preventDefault()
        
        var todoContainer = document.querySelector('#todo-container')
        var checkboxes = todoContainer.querySelectorAll('input[type=checkbox]')
        checkboxes.forEach((cbox) => {
          if (!cbox.checked) {
            cbox.click()
          }
        })
      })
      
      elRemoveAll.addEventListener('click', (e) => {
        e.preventDefault()

        if (!confirm('Yakin di remove semua prend?')) {
          return
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]))

        this.renderData()
      })

      // 6. ...
    },
    
    getAllData() {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || []
    },

    refreshContent(data) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
      this.renderData()
    },
    
    attachCreateEvent() {
      var form = document.querySelector('form#form-todo')
      var inputTodo = form.querySelector('input[name=todo]')

      form.addEventListener('submit', (e) => {
        // alert('submitted prend! '+ inputTodo.value)
        e.preventDefault()

        if (!inputTodo.value) {
          inputTodo.classList.add('is-danger')
          return
        }

        inputTodo.classList.remove('is-danger')

        var collection = this.getAllData()
        var newId = collection.length ? collection[collection.length-1].id +1 : 1
        
        collection.push({
          id: newId,
          status: false,
          content: inputTodo.value,
        })

        inputTodo.value = ''
        this.refreshContent(collection)
      })
    },

    renderData() {
      var data = this.getAllData()
      var todoContainer = document.querySelector('#todo-container')
      todoContainer.innerHTML = ''

      if (data.length < 1) {
        todoContainer.appendChild(this.tplEmpty())
      }

      data.forEach((item, index) => {
        var elItem = this.tplItem(item.id, item)
        todoContainer.appendChild(elItem)
      });

    },

    generateDefaultData() {
      console.log('// 2. Provide Default Data')
      var dummies = [
        {
          id: 1,
          status: true,
          content: 'Ngopi di warunge cak Sobirin'
        },
        {
          id: 2,
          status: false,
          content: 'Belajar JS Fundamental'
        },
        {
          id: 3,
          status: false,
          content: 'Tidur nyenyak'
        },
      ]
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dummies))
    },

    // === Template
    tplEmpty() {
      var container = document.createElement('div')
      container.classList.add('list-item', 'has-text-centered', 'has-text-grey')
      container.innerText = 'Untuk saat ini, Kosong prend...'
      return container
    },

    /**
     * Generates Template something like:
     */
    tplItem (id, data) {
      var elWrapper = document.createElement('div')
      elWrapper.classList.add('todo-item', 'list-item', 'is-clearfix')
      elWrapper.setAttribute('data-id', id)

      var elStatus = document.createElement('div')
      elStatus.classList.add('todo-status', 'is-pulled-left')

      var elStatusLabel = document.createElement('label')
      var elStatusCheckbox = document.createElement('input')
      elStatusLabel.classList.add('checkbox')
      elStatusCheckbox.setAttribute('type', 'checkbox')

      var elContent = document.createElement('div')
      elContent.classList.add('todo-content', 'is-pulled-left')
      elContent.innerText = data.content

      var elAction = document.createElement('div')
      var elActionDelete = document.createElement('a')
      elAction.classList.add('todo-action', 'is-pulled-right', 'has-text-right')
      elActionDelete.classList.add('todo-delete', 'button', 'is-small', 'is-danger')
      elActionDelete.setAttribute('data-id', id)
      elActionDelete.innerText = 'Delete'
      elAction.appendChild(elActionDelete)

      elStatusLabel.appendChild(elStatusCheckbox)
      elStatus.appendChild(elStatusLabel)
      elWrapper.appendChild(elStatus)
      elWrapper.appendChild(elContent)
      elWrapper.appendChild(elAction)

      if (data.status) {
        elWrapper.classList.add('has-background-success', 'has-text-white')
        elStatusCheckbox.checked = true
      }

      elStatusCheckbox.addEventListener('change', this.toggleCompleteEvent.bind(this))

      elActionDelete.addEventListener('click', this.deleteEvent.bind(this))

      return elWrapper
    },
    toggleCompleteEvent(e) {
      var elCheckbox = e.target
      var elItemWrapper = elCheckbox.closest('.todo-item')
      var id = elItemWrapper.getAttribute('data-id')

      var updated = this.getAllData().map(obj => {
        if (obj.id === parseInt(id)) {
          return Object.assign(obj, { status: elCheckbox.checked })
        }
        return obj
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))

      if (elCheckbox.checked) {
        elItemWrapper.classList.add('has-background-success', 'has-text-white')
      } else {
        elItemWrapper.classList.remove('has-background-success', 'has-text-white')
      }
    },
    deleteEvent(e) {
      e.preventDefault()

      if (!confirm('Yakin prend?')) {
        return;
      }

      var id = e.target.getAttribute('data-id')
      var collection = this.getAllData().filter((obj) => {
        return obj.id !== parseInt(id)
      })

      this.refreshContent(collection)
    }
  }

  sbydevTodo.init()

})()
