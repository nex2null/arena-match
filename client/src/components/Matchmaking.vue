<template>
  <div>
    <div>
      <div class="status-bar">There are {{ onlineUsers }} users currently online</div>
      <div class="status-bar">You are currently {{ connected ? 'connected' : 'disconnected' }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Matchmaking",
  data() {
    return {
      msg: ""
    };
  },
  computed: {
    ...mapGetters(["onlineUsers", "connected"])
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
