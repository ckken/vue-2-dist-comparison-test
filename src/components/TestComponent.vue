<template>
  <div class="test-component">
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <button @click="updateContent">更新内容</button>
  </div>
</template>

<script>
export default {
  name: 'TestComponent',
  data() {
    return {
      title: '测试组件',
      content: '这是初始内容'
    }
  },
  methods: {
    updateContent() {
      this.content = '内容已更新 - ' + new Date().toLocaleTimeString()
    }
  }
}
</script>

<style scoped>
.test-component {
  padding: 25px;
  border: 2px solid #007bff;
  border-radius: 12px;
  margin: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.enhanced {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

h2 {
  color: #007bff;
  margin-bottom: 15px;
  font-size: 1.5em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

p {
  color: #495057;
  margin-bottom: 20px;
  font-size: 1.1em;
  line-height: 1.5;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 0.9em;
  color: #6c757d;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

button {
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.primary {
  background-color: #007bff;
  color: white;
}

.primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.secondary {
  background-color: #6c757d;
  color: white;
}

.secondary:hover {
  background-color: #545b62;
  transform: translateY(-2px);
}

.accent {
  background-color: #28a745;
  color: white;
}

.accent:hover {
  background-color: #1e7e34;
  transform: translateY(-2px);
}

.content-history {
  border-top: 1px solid #dee2e6;
  padding-top: 15px;
}

.content-history h3 {
  color: #495057;
  font-size: 1.1em;
  margin-bottom: 10px;
}

.content-history ul {
  list-style: none;
  padding: 0;
}

.content-history li {
  background: #fff;
  padding: 8px 12px;
  margin-bottom: 5px;
  border-radius: 4px;
  border-left: 3px solid #007bff;
  font-size: 0.9em;
}
</style>