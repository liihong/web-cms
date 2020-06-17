import { login, logout, getMenu, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    loginState: {
      state: false,
      userInfo: {
        userName: '',
        email: '',
        photo: '',
        group: []
      },
      noticeCounts: 0
    },
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTERS: (state, routers) => {
      state.routers = routers
    },
    SET_LOGINSTATE: (state, data) => {
      state.loginState = data
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          const data = response.data.userInfo
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('获取权限信息有误!')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.photo)
          commit('SET_LOGINSTATE', response.data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetMenu({ commit, state }) {
      return new Promise((resolve, reject) => {
        getMenu(state.roles[0]).then(response => {
          commit('SET_ROUTERS', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    SetLoginState(state, params) {
      state.loginState = Object.assign({
        userInfo: {
          userName: '',
          email: '',
          photo: '',
          group: []
        },
        state: false
      }, {
          userInfo: params.userInfo,
          state: params.loginState || false,
          noticeCounts: params.noticeCounts
        });
    },
  }
}

export default user
