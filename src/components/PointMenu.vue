<template>
  <div class="fixed-overlay" @click.stop="$emit('close')">
    <div class="point-menu" :style="{ position: 'absolute', ...menuStyle }">
      <div class="menu-item" @click="$emit('end-point')">Завершить</div>
      <div class="menu-item" @click="$emit('delete-point')">Удалить точку</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PointMenu",
  emits: ['close', 'end-point', 'delete-point'],
  props: {
    menuStyle: Object,
  },
};
</script>
<style scoped>
div.fixed-overlay {
  z-index: 998;
  position: fixed;
  overflow: auto;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
div.point-menu {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px 0;
  background: rgb(255, 234, 234);
}
div.menu-item {
  padding: 2px 15px;
  text-align: start;
  font-size: 13px;
  cursor: pointer;
  transition: all .2s linear;
}
div.menu-item:hover {
  background: rgb(252, 168, 168);
}
</style>