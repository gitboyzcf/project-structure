<!-- 首页头部组件 -->
<template>
  <div class="tabBox">
    <div class="lfetImg">
      <!-- <img src="@/assets/images/" alt="" /> -->
      <div class="leftTitle">{{ title }}</div>
    </div>
    <div class="rightBox">
      <div v-for="(item, index) in dataList" :key="index" class="itemBox">
        <div class="title">{{ item.title }}</div>
        <div class="number">
          <v-count :delay="200" :value="item.num" :key="contkey" :separator="separator"></v-count>
          <span class="text">{{ item.prefix }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      contkey: 1,
      separator: "",
    };
  },
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    // 刷新数字
    refreshNum() {
      this.contkey++;
    },
  },
};
</script>
<style lang="scss" scoped>
.tabBox {
  z-index: 1;
  display: flex;
  align-items: center;

  .lfetImg {
    display: flex;
    align-items: center;
    width: 83px;
    line-height: 16px;

    img {
      width: 11px;
      height: 11px;
      display: inline-block;
    }

    .leftTitle {
      font-size: 16px;
      color: #ffd927;
      margin-left: 5px;
      font-weight: 600;
    }
  }

  .rightBox {
    display: flex;

    .itemBox {
      width: 130px;
      height: 46px;
      text-align: center;

      .title {
        font-size: 14px;
        color: #fff;
      }

      .number {
        width: 100%;
        font-size: 14px;
        color: #00fdec;
        display: flex;
        justify-content: center;
        align-items: center;
        text-shadow: -1px -1px 5px #00fdec;
        margin-top: 2px;

        .iCountUp {
          font-size: 26px;
          font-family: num;
          text-shadow: 2px 2px 5px #00fdec;
        }

        .text {
          font-size: 14px;
          margin-left: 5px;
          margin-top: 6px;
        }
      }
    }
  }
}

//@import url(); 引入公共css类
</style>
