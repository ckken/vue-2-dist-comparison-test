<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <TestComponent />
    <div class="new-content">
      <h2>新增内容测试</h2>
      <p>这是用于测试hash值变化的新增内容</p>
      <button @click="showMessage">点击测试</button>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import TestComponent from './components/TestComponent.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    TestComponent
  },
  methods: {
    showMessage() {
      alert('内容已修改，hash值应该发生变化！')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.new-content {
  margin: 20px 0;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 8px;
  border: 2px solid #4CAF50;
}

.new-content h2 {
  color: #4CAF50;
  margin-bottom: 10px;
}

.new-content button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.new-content button:hover {
  background-color: #45a049;
}
</style>
