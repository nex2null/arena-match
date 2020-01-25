<template>
  <div class="hello">
    <ul v-for="(msg, index) in messages" :key="index">
      <li>
        <span class="font-weight-bold">{{ msg }}</span>
      </li>
    </ul>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="msg" />
      <button>Send</button>
      <div class="status-bar">There are {{ onlineUsers }} users currently online</div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HelloWorld",
  data() {
    return {
      msg: ""
    };
  },
  computed: {
    ...mapGetters(["messages", "onlineUsers"])
  },
  mounted() {
    var username = window.prompt("Please enter a username.");
    this.$store.dispatch("login", username);
  },
  methods: {
    sendMessage() {
      this.$store.dispatch("sendMessage", this.msg);
      this.msg = "";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
