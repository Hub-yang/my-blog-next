<script>
export default {
  props: {
    category: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: '',
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      sortPosts: [],
      postListOffsetTop: 0,
    }
  },
  watch: {
    currentPage() {
      if (this.$route.query.p != this.currentPage) { // 此判断防止添加相同的路由信息（如浏览器回退时触发的）
        this.$router.push({
          query: {
            ...this.$route.query,
            p: this.currentPage,
          },
        })
      }
      // setTimeout(() => {
      //   window.scrollTo({ top: this.postListOffsetTop }) // behavior: 'smooth'
      // },0)
      this.setPosts()
    },
    category() {
      this.setPosts()
    },
    tag() {
      this.setPosts()
    },
  },
  created() {
    this.setPosts()
  },
  mounted() {
    // this.postListOffsetTop = this.getElementToPageTop(this.$refs.postList) - 240
  },
  methods: {
    setPosts() {
      const currentPage = this.currentPage
      const perPage = this.perPage

      let posts = []
      if (this.category) {
        posts = this.$groupPosts.categories[this.category]
      }
      else if (this.tag) {
        posts = this.$groupPosts.tags[this.tag]
      }
      else {
        posts = this.$sortPosts
      }

      this.sortPosts = posts.slice((currentPage - 1) * perPage, currentPage * perPage)
    },
    // getElementToPageTop(el) {
    //   if(el && el.parentElement) {
    //     return this.getElementToPageTop(el.parentElement) + el.offsetTop
    //   }
    //   return el.offsetTop
    // }
  },
}
</script>

<template>
  <div ref="postList" class="post-list">
    <transition-group tag="div" name="post">
      <div
        v-for="item in sortPosts"
        :key="item.key"
        class="post card-box"
        :class="item.frontmatter.sticky && 'iconfont icon-zhiding'"
      >
        <div class="title-wrapper">
          <h2>
            <router-link :to="item.path">
              {{ item.title }}
              <span v-if="item.frontmatter.titleTag" class="title-tag">{{
                item.frontmatter.titleTag
              }}</span>
            </router-link>
          </h2>
          <div class="article-info">
            <a
              v-if="item.author && item.author.href"
              title="作者"
              class="iconfont icon-touxiang"
              target="_blank"
              :href="item.author.href"
            >{{ item.author.name ? item.author.name : item.author }}</a>
            <span
              v-else-if="item.author"
              title="作者"
              class="iconfont icon-touxiang"
            >{{ item.author.name ? item.author.name : item.author }}</span>

            <span
              v-if="item.frontmatter.date"
              title="创建时间"
              class="iconfont icon-riqi"
            >{{ item.frontmatter.date.split(' ')[0] }}</span>
            <span
              v-if="
                $themeConfig.category !== false && item.frontmatter.categories
              "
              title="分类"
              class="iconfont icon-wenjian"
            >
              <router-link
                v-for="(c, index) in item.frontmatter.categories"
                :key="index"
                :to="`/categories/?category=${encodeURIComponent(c)}`"
              >{{ c }}</router-link>
            </span>
            <span
              v-if="
                $themeConfig.tag !== false
                  && item.frontmatter.tags
                  && item.frontmatter.tags[0]
              "
              title="标签"
              class="iconfont icon-biaoqian tags"
            >
              <router-link
                v-for="(t, index) in item.frontmatter.tags"
                :key="index"
                :to="`/tags/?tag=${encodeURIComponent(t)}`"
              >{{ t }}</router-link>
            </span>
          </div>
        </div>
        <div v-if="item.excerpt" class="excerpt-wrapper">
          <div class="excerpt" v-html="item.excerpt" />
          <router-link
            :to="item.path"
            class="readmore iconfont icon-jiantou-you"
          >
            阅读全文
          </router-link>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style lang='stylus'>
.post-list
  margin-bottom 3rem
  .post
    position relative
    padding 1rem 1.5rem
    margin-bottom 0.8rem
    transition all 0.3s
    // border-bottom 1px solid var(--borderColor)
    &:last-child
      border-bottom none
    &.post-leave-active
      display none
    &.post-enter
      opacity 0
      transform translateX(-20px)
    &::before
      position absolute
      top -1px
      right 0
      font-size 2.5rem
      color $activeColor
      opacity 0.85
    .title-wrapper
      a
        color var(--textColor)
        &:hover
          color $accentColor
      h2
        margin 0.5rem 0
        font-size 1.4rem
        border none
        .title-tag
          height 1.2rem
          line-height 1.2rem
          border 1px solid $activeColor
          color $activeColor
          font-size 0.8rem
          padding 0 0.35rem
          border-radius 0.2rem
          margin-left 0rem
          transform translate(0, -0.15rem)
          display inline-block
        a
          display block
          @media (max-width $MQMobile)
            font-weight 400
      .article-info
        > a, > span
          opacity 0.7
          font-size 0.8rem
          margin-right 1rem
          cursor pointer
          &::before
            margin-right 0.3rem
          a
            margin 0
            &:not(:first-child)
              &::before
                content '/'
        .tags a:not(:first-child)::before
          content '、'
    .excerpt-wrapper
      border-top 1px solid var(--borderColor)
      margin 0.5rem 0
      overflow hidden
      .excerpt
        margin-bottom 0.3rem
        font-size 0.92rem
        h1, h2, h3
          display none
        img
          max-height 280px
          max-width 100% !important
          margin 0 auto
      .readmore
        float right
        margin-right 1rem
        line-height 1rem
        &::before
          float right
          font-size 0.8rem
          margin 0.1rem 0 0 0.2rem
.theme-style-line
  .post-list
    border 1px solid var(--borderColor)
    border-bottom none
    border-radius 5px
    overflow hidden
    .post
      margin-bottom 0
      border none
      border-bottom 1px solid var(--borderColor)
      border-radius 0
</style>
