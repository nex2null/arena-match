<template>
  <div class="container pt-2">
    <div class="columns">
      <div class="column p-centered col-xs-12 col-sm-10 col md-8 col-lg-6 col-3">
        <div v-if="matchEndReason">
          <h5 class="p-centered">{{ matchEndReason }}</h5>
        </div>
        <div v-if="!match">
          <Queue />
        </div>
        <div v-if="match">
          <Match />
        </div>
        <div style="margin-top:20px;">
          <div>There are {{ onlineUsers }} users currently online</div>
          <div v-if="!connected">Connection lost. Attempting to reconnect...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Queue from "@/components/Queue.vue";
import Match from "@/components/Match.vue";
import { mapGetters } from "vuex";

export default {
  name: "Matchmaking",
  components: {
    Queue,
    Match
  },
  computed: {
    ...mapGetters(["onlineUsers", "connected", "match", "matchEndReason"])
  }
};
</script>
