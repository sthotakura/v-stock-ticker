<template>
  <div class="ticker-container">
    <div class="ticker-header">
      <div class="market-status-indicator" :class="{open: isMarketOpen}"></div>
      <div class="symbol" :title="symbol">{{symbol}}</div>
      <div class="timestamp">{{displayTimestamp}}</div>
    </div>
    <div class="ticker-body">
      <div class="price" :class="tickState" ref="price">{{price}}</div>
      <div class="price-difference">
        <div class="difference-indicator" :class="priceState"></div>
        <div class="difference" :class="priceState">{{differenceFormatted}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StockTicker",

  props: {
    isMarketOpen: { type: Boolean, default: false },
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    difference: { type: Number, required: true },
    differencePercentage: { type: Number, required: true },
  },

  data() {
    return {
      timestamp: new Date(Date.now()),
      tickState: undefined,
    };
  },

  computed: {
    priceState() {
      return this.difference > 0
        ? "up"
        : this.difference < 0
        ? "down"
        : "no-change";
    },
    differenceFormatted() {
      const absoluteDifference = Math.abs(this.difference);
      return `${absoluteDifference} (${this.difference < 0 ? "-" : "+"}${
        this.differencePercentage
      }%)`;
    },
    displayTimestamp() {
      return `${this.timestamp.getHours()}:${String(
        this.timestamp.getMinutes()
      ).padStart(2, "0")}:${String(this.timestamp.getSeconds()).padStart(
        2,
        "0"
      )}`;
    },
  },

  watch: {
    price(newValue, oldValue) {
      this.timestamp = new Date(Date.now());
      this.tickState =
        oldValue > newValue
          ? "tick-down"
          : oldValue < newValue
          ? "tick-up"
          : undefined;
      if (this.tickState) {
        this.$refs.price.addEventListener(
          "animationend",
          this.handlePriceAnimationEnded
        );
      }
    },
  },

  methods: {
    handlePriceAnimationEnded() {
      this.$refs.price.removeEventListener(
        "animationend",
        this.handlePriceAnimationEnded
      );
      this.tickState = undefined;
    },
  },
};
</script>

<style scoped>
.ticker-container {
  width: 250px;
  border: 2px #707070 solid;
  color: #707070;
  cursor: default;
  background: linear-gradient(#fff, #eee, #eee, #eee, #eee, #ddd, #ccc);
}

.ticker-header {
  display: flex;
  flex-flow: row nowrap;
  border-bottom: 2px #707070 solid;
}

.ticker-header .market-status-indicator {
  width: 1rem;
  height: 1rem;
  background-color: #bbb;
  border-radius: 50%;
  margin: 0.25rem 0.5rem 0.25rem 0.5rem;
}

.ticker-header .market-status-indicator.open {
  background-color: #00bc2c;
}

.ticker-header .symbol {
  font-weight: bold;
  text-align: left;
  align-self: flex-end;
  margin-right: 2rem;
  flex: 1 0 auto;
}

.ticker-header .timestamp {
  text-align: right;
  margin-right: 0.125rem;
  align-self: center;
  font-size: 0.8rem;
}

.ticker-body {
  padding: 0.25rem;
}

.price {
  font-weight: bold;
  font-size: 2.5rem;
  text-align: right;
}

.price.tick-up {
  animation: tick-up 0.3s;
}

.price.tick-down {
  animation: tick-down 0.3s;
}

@keyframes tick-up {
  0% {
    color: #00bc2c;
  }
  50% {
    color: #00bc2c;
  }
  100% {
    color: #707070;
  }
}

@keyframes tick-down {
  0% {
    color: #bc0007;
  }
  50% {
    color: #bc0007;
  }
  100% {
    color: #707070;
  }
}

.price-difference {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  font-size: 1.5rem;
  font-weight: bold;
}

.price-difference .difference-indicator {
  border: 1rem solid transparent;
  margin-right: 0.25rem;
}

.price-difference .difference-indicator.up {
  border-top: 0 solid transparent;
  border-bottom: 1rem solid #00bc2c;
  margin-bottom: 0.5rem;
}

.price-difference .difference-indicator.down {
  border-top: 1rem solid #bc0007;
  border-bottom: 0 solid transparent;
  margin-top: 0.5rem;
}

.price-difference .difference.up {
  color: #00bc2c;
}

.price-difference .difference.down {
  color: #bc0007;
}
</style>