import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    login: false,
    user: null,
    entry: null,
    message: null,
    timestamp: 0
  },
  mutations: {
    toggleLoading: (state, payload) => {
      state.loading = payload
    },
    login: (state, payload) => {
      state.login = true
      state.user = payload.user
      state.entry = payload.user // a entrymap to user self is always exists
    },
    logout: state => {
      state.login = false
      state.user = null
    },
    changeEntry: (state, payload) => {
      state.entry = payload
    },
    updateMessage: (state, val) => {
      state.message = val
      state.timestamp++
    }
  },
  actions: {}
})
