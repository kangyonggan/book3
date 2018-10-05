// pages/sections/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    novelCode: '',
    apiUrl: app.apiUrl,
    isLoading: false,
    emptyText: "加载中...",
    pageNum: 1,
    list: []
  },

  detail: function (e) {
    let sectionCode = e.currentTarget.dataset.code;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../detail/index?sectionCode=' + sectionCode + "&title=" + title
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      novelCode: options.novelCode
    });

    wx.setNavigationBarTitle({
      title: options.name
    })

    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    this.loadData(true);
  },

  /**
   * 加载数据
   */
  loadData: function (direct) {
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
    if (direct) {
      that.setData({
        pageNum: that.data.pageNum - 1
      });
    } else {
      that.setData({
        pageNum: that.data.pageNum + 1
      });
    }
    if (that.data.pageNum == 0) {
      that.setData({
        pageNum: 1
      });
    }
    wx.request({
      method: "GET",
      url: app.apiUrl + "/book/sections?novelCode=" + that.data.novelCode + "&pageNum=" + that.data.pageNum,
      success: function (res) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        if (res.data.respCo == '0000') {
          if (res.data.pageInfo.list.length == 0) {
            that.setData({
              isLoading: false
            });
            that.setData({
              emptyText: '没有更多章节了'
            });
            app.message("没有更多章节了");
            if (!direct) {
              that.setData({
                pageNum: that.data.pageNum - 1
              });
            }
            return;
          }

          that.setData({
            list: []
          });

          that.setData({
            isLoading: false,
            list: that.data.list.concat(res.data.pageInfo.list)
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
    this.loadData(true);
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    this.loadData(false);
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})