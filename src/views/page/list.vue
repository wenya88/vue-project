<template>
  <div class="hello">
   <div class="header">
      我是头部
	  </div>
    <div class="menu-box" id="searchBar">
        <ul :class="searchBarFixed == true ? 'isFixed' :''">
          <li><span>1</span></li>
          <li><span>2</span></li>
          <li><span>3</span></li>
          <li><span>4</span></li>
          <li><span>5</span></li>
        </ul>
      </div>
    <div class="main-Container"  :style="{ marginTop: AllHeight+'px' }">
    <br>
    <br>
    <br>
    我是主体
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      searchBarFixed:false,
      AllHeight:"",
      msg: 'Welcome to Your Vue.js App',
      menuData:[
    {
        "id": 17,
        "imageUrl": "http://storage.shjhome.com:9000/webmenu/mobile/images/9774d9b50f3f4537bc2496e51acc8838.jpg",
        "name": "装修案例",
        "url": "/caseList",
        "label": ""
    },
    {
        "id": 11,
        "imageUrl": "http://storage.shjhome.com:9000/webmenu/mobile/images/ff67b75426584d5290b4304f2d30da8f.jpg",
        "name": "选设计师",
        "url": "/designerList",
        "label": ""
    },
    {
        "id": 15,
        "imageUrl": "http://storage.shjhome.com:9000/webmenu/mobile/images/01e92026c1274cffb570061b123d5241.jpg",
        "name": "核心优势",
        "url": "/specialTopic?id=1152",
        "label": ""
    },
    {
        "id": 16,
        "imageUrl": "http://storage.shjhome.com:9000/webmenu/mobile/images/add58e7368c144b498292413dff56e8e.jpg",
        "name": "我家小区",
        "url": "/homeCommunityList",
        "label": ""
    },
    
]
    }
  },
  mounted() {
    
      window.addEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll () {
      console.log('111')
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      var offsetTop = document.getElementById('searchBar').offsetTop
      console.log(scrollTop, offsetTop)
      if (scrollTop > offsetTop) {
        this.searchBarFixed = true
        // this.AllHeight = document.getElementById('searchBar').clientHeight;
      } else {
        this.searchBarFixed = false
        // this.AllHeight = 0
      }
       
        
    },
  }
}
</script>


<style >
* {
    -webkit-transition: all .4s;
    transition: all .4s;
}
.header {
  background: #8e9efe;
  height:120px;
  line-height:120px;
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	}
  .isFixed{
    position:fixed;
    background-color:#Fff;
    top:0;
    left:0;
    z-index:999;
  }

  .menu-box {
	background: #fff;
  height:80px;
	overflow: hidden;
	}
.menu-box ul {
	display: inline-block;
	width: 100%;
	}
.menu-box li {
  
	display: inline-block;
	text-align: center;
  padding:10px 0;
  margin: 0 10px;
	}

.menu-box span {
	width: 60px;
	height: 60px;
  line-height:  60px;
	display: inline-block;
	z-index: 1;
	border-radius:50%;
  background: #48affa;
	}
.main-Container{
  min-height:900px;
    background: #ffa746;
        -webkit-transition: all 0s;
    transition: all 0s;
}
[v-cloak]{
	display: none;
	}



</style>
