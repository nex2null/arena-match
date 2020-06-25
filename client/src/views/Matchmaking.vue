<template>
  <div class="container pt-2">
    <div class="columns">
      <div v-if="!username" class="column p-centered col-xs-12 col-sm-10 col md-8 col-lg-6 col-3">
        <Username />
      </div>
      <div v-if="username" class="column p-centered col-xs-12 col-sm-10 col md-8 col-lg-6 col-3">
        <!-- <div v-if="matchEndReason">
          <h6 class="p-centered">{{ matchEndReason }}</h6>
        </div>-->
        <div v-if="!activeMatch">
          <CreateMatch />
        </div>
        <div v-if="!activeMatch && !matchCreating">
          <MatchList />
        </div>
        <div v-if="activeMatch">
          <Match />
        </div>
        <div style="margin-top:50px;">
          <div class="divider"></div>
          <div v-if="connected">Logged in as {{ username }}</div>
          <div v-if="connected">There are {{ onlineUsers }} users currently online</div>
          <div v-if="!connected">Connection lost. Attempting to reconnect...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateMatch from "@/components/CreateMatch.vue";
import MatchList from "@/components/MatchList.vue";
import Username from "@/components/Username.vue";
import Match from "@/components/Match.vue";

import { mapGetters } from "vuex";

export default {
  name: "Matchmaking",
  components: {
    CreateMatch,
    MatchList,
    Username,
    Match
  },
  computed: {
    ...mapGetters([
      "onlineUsers",
      "connected",
      "matchCreating",
      "matchCreated",
      "activeMatch",
      "username",
      "matchEndReason"
    ])
  }
};
</script>
