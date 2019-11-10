// pages/shelf/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    apiUrl: app.apiUrl,
    isLoading: false,
    emptyText: "加载中...",
    list: []
  },

  /**
   * 章节列表/详情
   */
  detail: function (e) {
    let novelId = e.currentTarget.dataset.id + '';
    var that = this;
    wx.getStorage({
      key: novelId,
      success: function (res) {
        wx.navigateTo({
          url: '../detail/index?novelId=' + novelId + '&sectionId=' + res.data.sectionId
        })
      },
      fail: function () {
        wx.navigateTo({
          url: '../sections/index?novelId=' + novelId
        })
      }
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData: function () {
    let that = this;
    if (that.data.isLoading) {
      return;
    }
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    that.setData({
      isLoading: true,
      emptyText: '加载中...'
    });
    wx.request({
      method: "GET",
      url: app.apiUrl + "/novel?pageSzie=9999&prop=hold&order=descending",
      success: function (res) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();

        if (res.data.respCo == '0000') {
          if (res.data.data.pageInfo.list.length == 0) {
            that.setData({
              isLoading: false
            });
            that.setData({
              emptyText: '暂时没有可以阅读的书籍'
            });
            return;
          }

          that.setData({
            isLoading: false,
            debug: false,
            list: res.data.data.pageInfo.list
          });
        } else {
          that.setData({
            isLoading: false,
            emptyText: res.data.respMsg
          });
        }
      },
      fail: function (err) {
        that.setData({
          isLoading: false,
          emptyText: '网络错误，请下拉重试！'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})