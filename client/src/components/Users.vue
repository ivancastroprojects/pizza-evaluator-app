<template>
  <div class="admin-dashboard">
    <div v-if="isManager" class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Panel de Administración</h1>
        <p class="page-subtitle">Gestiona usuarios, managers y pizzas desde un solo lugar.</p>
      </div>

      <!-- Managers Section -->
      <div class="admin-section">
        <h2 class="section-title">Managers</h2>
        <div class="actions-bar">
          <button @click="isCreateClicked = !isCreateClicked" class="btn btn-primary">
            {{ isCreateClicked ? 'Cancelar' : 'Crear Manager' }}
          </button>
        </div>

        <!-- Create/Edit Form -->
        <form v-if="isCreateClicked" @submit.prevent="createManager" class="form-card">
          <input type="email" v-model="newManager.username" placeholder="Email del Manager" required>
          <input type="password" v-model="newManager.password" placeholder="Contraseña" required>
          <button type="submit" class="btn btn-success">Guardar</button>
        </form>
        <form v-if="isEditClicked" @submit.prevent="editManager" class="form-card">
          <input type="email" v-model="actualManager.username" required readonly>
          <input type="password" v-model="actualManager.password" placeholder="Nueva contraseña (opcional)">
          <button type="submit" class="btn btn-success">Actualizar</button>
          <button type="button" @click="isEditClicked = false" class="btn btn-secondary">Cancelar</button>
        </form>
        <!-- Data Table -->
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(manager, index) in managersData" :key="manager.id">
                <td>{{ manager.id }}</td>
                <td>{{ manager.username }}</td>
                <td>{{ formatDate(manager.createdAt) }}</td>
                <td class="actions-cell">
                  <button class="btn-icon edit" @click="showEditManager(manager, index)">✏️</button>
                  <button class="btn-icon delete" @click="deleteManager(manager.id, index)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Users Section (similar structure) -->
      <div class="admin-section">
        <h2 class="section-title">Usuarios</h2>
        <!-- User management UI here -->
         <div class="actions-bar">
          <button @click="createUserButtonClicked" class="btn btn-primary">
            {{ isCreateUserClicked ? 'Cancelar' : 'Crear Usuario' }}
          </button>
        </div>
        <form v-if="isCreateUserClicked" @submit.prevent="createUser" class="form-card">
          <input type="text" v-model="newUser.name" placeholder="Nombre de usuario" required>
          <input type="password" v-model="newUser.password" placeholder="Contraseña" required>
          <input type="text" v-model="newUser.gender" placeholder="Género">
          <input type="date" v-model="newUser.birthday" placeholder="Cumpleaños">
          <button type="submit" class="btn btn-success">Guardar</button>
        </form>
         <form v-if="isEditUserClicked" @submit.prevent="editUser" class="form-card">
            <input type="text" v-model="actualUser.name" required readonly>
            <input type="password" v-model="actualUser.password" placeholder="Nueva contraseña (opcional)">
             <input type="text" v-model="actualUser.gender" placeholder="Género">
            <input type="date" v-model="actualUser.birthday" placeholder="Cumpleaños">
            <button type="submit" class="btn btn-success">Actualizar</button>
            <button type="button" @click="isEditUserClicked = false" class="btn btn-secondary">Cancelar</button>
        </form>
        <div class="table-responsive">
          <table class="data-table">
             <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in usersData" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td class="actions-cell">
                  <button class="btn-icon edit" @click="showEditUser(user, index)">✏️</button>
                  <button class="btn-icon delete" @click="deleteUser(user.name, index)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pizzas Section -->
      <div class="admin-section">
        <h2 class="section-title">Pizzas</h2>
        <div class="actions-bar">
           <button @click="createPizzaButtonClicked" class="btn btn-primary">
            {{ isCreatePizzaClicked ? 'Cancelar' : 'Crear Pizza' }}
          </button>
        </div>
        <!-- Create/Edit Pizza Forms -->
        <form v-if="isCreatePizzaClicked" @submit.prevent="submitCreatePizza" class="form-card">
          <input type="text" v-model="newPizzaData.name" placeholder="Nombre Pizza" required>
          <textarea v-model="newPizzaData.ingredients" placeholder="Ingredientes" rows="2"></textarea>
          <input type="text" v-model="newPizzaData.imageUrl" placeholder="URL Imagen">
          <input type="number" v-model="newPizzaData.price" placeholder="Precio" step="0.01">
          <button type="submit" class="btn btn-success">Guardar Pizza</button>
        </form>
        <form v-if="isEditPizzaClicked" @submit.prevent="submitEditPizza" class="form-card">
           <input type="text" v-model="actualPizzaData.name" required>
           <textarea v-model="actualPizzaData.ingredients" rows="2"></textarea>
           <input type="text" v-model="actualPizzaData.imageUrl">
           <input type="number" v-model.number="actualPizzaData.price" step="0.01">
           <button type="submit" class="btn btn-success">Actualizar Pizza</button>
           <button type="button" @click="cancelEditPizza" class="btn btn-secondary">Cancelar</button>
        </form>
        <!-- Pizzas Table -->
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Votos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pizza in pizzasData" :key="pizza.id">
                <td>{{ pizza.id }}</td>
                <td>{{ pizza.name }}</td>
                <td>
                  <input type="number" min="0" v-model.number="editableVotes[pizza.id]" class="vote-input">
                  <button class="btn-icon save" @click="savePizzaVotes(pizza)">💾</button>
                </td>
                <td class="actions-cell">
                  <button class="btn-icon edit" @click="showEditPizzaForm(pizza)">✏️</button>
                  <button class="btn-icon delete" @click="confirmDeletePizza(pizza.id, pizza.name)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
    <div v-else class="container no-access">
      <h1>Acceso Denegado</h1>
      <p>Debes ser un administrador para ver esta página.</p>
      <router-link to="/login" class="btn btn-primary">Iniciar Sesión</router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserService from '../services/userService'
import PizzaService from '../services/pizzaService'

export default {
  name: 'UsersManagement',
  data () {
    return {
      isCreateClicked: false,
      isEditClicked: false,
      managersData: [],
      newManager: {
        username: '',
        password: ''
      },
      actualManager: {
        id: null,
        username: '',
        password: ''
      },
      usersData: [],
      isCreateUserClicked: false,
      isEditUserClicked: false,
      newUser: {
        name: '',
        gender: '',
        birthday: '',
        password: ''
      },
      actualUser: {
        id: null,
        name: '',
        gender: '',
        birthday: '',
        password: ''
      },
      // New data for Pizza Management
      isCreatePizzaClicked: false,
      newPizzaData: {
        name: '',
        ingredients: '',
        imageUrl: '',
        price: null
      },
      pizzasData: [],
      editableVotes: {},
      // For Pizza Editing
      isEditPizzaClicked: false,
      actualPizzaData: {
        id: null,
        name: '',
        ingredients: '',
        imageUrl: '',
        price: null
      }
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    isManager () {
      return this.user && this.user.role === 'manager'
    }
  },
  watch: {
    isManager (newValue) {
      if (newValue) {
        this.getManagers()
        this.getUsers()
        this.fetchPizzas()
      }
    }
  },
  created () {
    if (this.isManager) {
      this.getManagers()
      this.getUsers()
      this.fetchPizzas()
    }
  },
  methods: {
    formatDate (date) {
      return new Date(date).toLocaleDateString('es-ES')
    },
    // Manager Methods
    async getManagers () {
      if (!this.isManager) return
      try {
        const response = await UserService.getManagers()
        this.managersData = response.data
      } catch (error) {
        console.error('Error fetching managers:', error)
        this.managersData = []
      }
    },
    createButtonClicked () {
      this.isCreateClicked = !this.isCreateClicked
      this.isEditClicked = false
      this.newManager = { username: '', password: '' }
    },
    showEditManager (manager) {
      this.actualManager.id = manager.id
      this.actualManager.username = manager.username
      this.actualManager.password = ''
      this.isEditClicked = true
      this.isCreateClicked = false
    },
    async createManager () {
      try {
        await UserService.createManager({
          username: this.newManager.username,
          password: this.newManager.password
        })
        this.getManagers()
        this.isCreateClicked = false
        this.newManager = { username: '', password: '' }
      } catch (e) {
        let detailMessage = ''
        if (e.response &&
            e.response.data &&
            e.response.data.err &&
            e.response.data.err.errors &&
            typeof e.response.data.err.errors.length === 'number' &&
            e.response.data.err.errors.length > 0 &&
            e.response.data.err.errors[0] &&
            e.response.data.err.errors[0].message) {
          detailMessage = e.response.data.err.errors[0].message
        } else if (e.response && e.response.data && e.response.data.error) {
          detailMessage = e.response.data.error
        }
        alert('Error creando manager: ' + (detailMessage || e.message))
      }
    },
    async deleteManager (managerId, index) {
      if (confirm('¿Estás seguro de que quieres eliminar este manager?')) {
        try {
          await UserService.deleteManager(managerId)
          this.managersData.splice(index, 1)
        } catch (error) {
          console.error('Error al eliminar manager:', error)
        }
      }
    },
    async editManager () {
      try {
        const updateData = {}
        if (this.actualManager.password) {
          updateData.password = this.actualManager.password
        }
        if (Object.keys(updateData).length > 0) {
          await UserService.updateManager(this.actualManager.id, updateData)
          this.getManagers()
          this.isEditClicked = false
          this.actualManager.password = ''
        } else {
          this.isEditClicked = false
        }
      } catch (error) {
        console.error('Error al actualizar manager:', error)
      }
    },
    // User Methods
    async getUsers () {
      if (!this.isManager) return
      try {
        const response = await UserService.getUsers()
        this.usersData = response.data
      } catch (error) {
        console.error('Error al obtener usuarios:', error)
      }
    },
    createUserButtonClicked () {
      this.isCreateUserClicked = !this.isCreateUserClicked
    },
    async createUser () {
      try {
        await UserService.createUser(this.newUser)
        this.getUsers()
        this.isCreateUserClicked = false
        this.newUser = { name: '', gender: '', birthday: '', password: '' }
      } catch (error) {
        console.error('Error al crear usuario:', error)
      }
    },
    showEditUser (user, index) {
      this.isEditUserClicked = true
      this.actualUser = { ...user, password: '' }
    },
    async editUser () {
      try {
        const payload = { ...this.actualUser }
        if (!payload.password) delete payload.password
        await UserService.updateUser(payload)
        this.getUsers()
        this.isEditUserClicked = false
        this.actualUser = { id: null, name: '', gender: '', birthday: '', password: '' }
      } catch (error) {
        console.error('Error al actualizar usuario:', error)
      }
    },
    async deleteUser (username, index) {
      if (confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
        try {
          await UserService.deleteUser(username)
          this.usersData.splice(index, 1)
        } catch (error) {
          console.error('Error al eliminar usuario:', error)
        }
      }
    },
    // Pizza Methods
    async fetchPizzas () {
      try {
        const username = this.user ? this.user.name : null
        const response = await PizzaService.fetchPizzas('', username)
        this.pizzasData = response.data
        // Initialize editableVotes for each pizza
        this.pizzasData.forEach(pizza => {
          this.$set(this.editableVotes, pizza.id, pizza.votes)
        })
      } catch (error) {
        console.error('Error fetching pizzas for admin panel:', error)
      }
    },
    createPizzaButtonClicked () {
      this.isCreatePizzaClicked = !this.isCreatePizzaClicked
      if (this.isCreatePizzaClicked) {
        this.newPizzaData = { name: '', ingredients: '', imageUrl: '', price: null }
      }
    },
    async submitCreatePizza () {
      try {
        if (!this.newPizzaData.name.trim()) {
          alert('El nombre de la pizza es obligatorio.')
          return
        }
        await PizzaService.createPizza(this.newPizzaData)
        alert(`Pizza "${this.newPizzaData.name}" creada exitosamente.`)
        this.newPizzaData = { name: '', ingredients: '', imageUrl: '', price: null }
        this.isCreatePizzaClicked = false
        await this.fetchPizzas()
      } catch (error) {
        console.error('Error creando pizza:', error)
        let errorMessage = 'Error desconocido al crear la pizza.'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (error.message) {
          errorMessage = error.message
        }
        alert('Error creando pizza: ' + errorMessage)
      }
    },
    async savePizzaVotes (pizza) {
      const newVotes = this.editableVotes[pizza.id]
      if (typeof newVotes !== 'number' || isNaN(newVotes) || newVotes < 0) {
        alert('Por favor, introduce un número válido de votos (mayor o igual a 0).')
        return
      }
      try {
        await PizzaService.updatePizzaVotes(pizza.id, newVotes)
        alert(`Votos actualizados para la pizza "${pizza.name}".`)
        await this.fetchPizzas()
      } catch (error) {
        console.error('Error actualizando votos:', error)
        let errorMessage = 'Error desconocido al actualizar los votos.'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (error.message) {
          errorMessage = error.message
        }
        alert('Error actualizando votos: ' + errorMessage)
      }
    },
    showEditPizzaForm (pizza) {
      this.actualPizzaData = { ...pizza }
      this.isEditPizzaClicked = true
      this.isCreatePizzaClicked = false
    },
    cancelEditPizza () {
      this.isEditPizzaClicked = false
      this.actualPizzaData = { id: null, name: '', ingredients: '', imageUrl: '', price: null }
    },
    async submitEditPizza () {
      if (!this.actualPizzaData.name || !this.actualPizzaData.name.trim()) {
        alert('El nombre de la pizza es obligatorio.')
        return
      }
      try {
        await PizzaService.updatePizza(this.actualPizzaData.id, this.actualPizzaData)
        alert(`Pizza "${this.actualPizzaData.name}" actualizada exitosamente.`)
        this.cancelEditPizza()
        await this.fetchPizzas()
      } catch (error) {
        console.error('Error actualizando pizza:', error)
        let errorMessage = 'Error desconocido al actualizar la pizza.'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (error.message) {
          errorMessage = error.message
        }
        alert('Error actualizando pizza: ' + errorMessage)
      }
    },
    async confirmDeletePizza (pizzaId, pizzaName) {
      if (confirm(`¿Estás seguro de que quieres eliminar la pizza "${pizzaName}"?`)) {
        try {
          await PizzaService.deletePizza(pizzaId)
          alert(`Pizza "${pizzaName}" eliminada exitosamente.`)
          await this.fetchPizzas()
        } catch (error) {
          console.error('Error eliminando pizza:', error)
          let errorMessage = 'Error desconocido al eliminar la pizza.'
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message
          } else if (error.response && error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error
          } else if (error.message) {
            errorMessage = error.message
          }
          alert('Error eliminando pizza: ' + errorMessage)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.admin-dashboard {
  padding: 40px 0;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}
.page-title {
  font-size: 36px;
  font-weight: 800;
  color: #333;
}
.page-subtitle {
  font-size: 18px;
  color: #777;
}

/* Sections */
.admin-section {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #E12E2E;
}

/* Actions Bar */
.actions-bar {
  margin-bottom: 20px;
}

/* Forms */
.form-card {
  background-color: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.form-card input, .form-card textarea {
  flex: 1 1 180px;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.form-card textarea {
  flex-basis: 100%;
}

/* Tables */
.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th, .data-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

.data-table th {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  background-color: #f9f9f9;
}

.data-table td {
  font-size: 14px;
  color: #333;
}

.actions-cell {
  display: flex;
  gap: 10px;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #E12E2E;
  color: white;
}
.btn-primary:hover {
  background-color: #c02424;
}

.btn-success {
  background-color: #28a745;
  color: white;
}
.btn-success:hover {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}
.btn-icon.edit { color: #007bff; }
.btn-icon.delete { color: #dc3545; }

/* No Access Page */
.no-access {
  text-align: center;
  padding: 80px 0;
}

.vote-input {
  width: 60px;
  padding: 5px;
  text-align: center;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-right: 5px;
}

.btn-icon.save { color: #28a745; }
</style>
