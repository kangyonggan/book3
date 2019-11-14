// pages/detail/index.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * Page initial data
   */
  data: {
    novelId: '',
    sectionId: '',
    isLoading: false,
    section: {},
    prevSection: {},
    nextSection: {},
    emptyText: '加载中...',
    hasContent: false
  },

  refresh: function () {
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
      method: "PUT",
      url: app.apiUrl + "/novel/" + that.data.section.novelId + "/pull",
      success: function (res) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        if (res.data.respCo == '0000') {
          that.setData({
            hasContent: true,
            isLoading: false,
            emptyText: '已经加入更新队列，请稍后下拉刷新查询最新章节'
          });
          app.message("已经加入更新队列，请稍后下拉刷新查询最新章节");
        } else {
          that.setData({
            hasContent: true,
            isLoading: false,
            emptyText: res.data.respMsg
          });
          app.message(res.data.respMsg);
        }
      },
      fail: function (err) {
        that.setData({
          hasContent: true,
          isLoading: false,
          emptyText: '网络错误，请稍后再试！'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },

  prevSection: function () {
    this.loadData(this.data.prevSection.id);
  },

  nextSection: function () {
    this.loadData(this.data.nextSection.id);
  },

  pwd: function () {
    wx.navigateTo({
      url: '../sections/index?novelId=' + this.data.section.novelId
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      sectionId: options.sectionId,
      novelId: options.novelId
    });

    this.loadData(this.data.sectionId);
  },

  /**
   * 加载数据
   */
  loadData: function (sectionId) {
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
      url: app.apiUrl + "/novel/" + that.data.novelId + "/" + sectionId,
      success: function (res) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        if (res.data.respCo == '0000') {
          that.setData({
            isLoading: false,
            hasContent: true,
            sectionId: res.data.data.section.id,
            section: res.data.data.section,
            prevSection: res.data.data.prevSection,
            nextSection: res.data.data.nextSection
          });

          wx.pageScrollTo({
            scrollTop: 0,
            duration: 200,
          })

          let content = res.data.data.section.content;
          WxParse.wxParse('content', 'html', content, that, 0);

          wx.setStorage({
            key: that.data.novelId,
            data: {
              sectionId: sectionId
            }
          })
        } else {
          that.setData({
            hasContent: false,
            isLoading: false,
            emptyText: res.data.respMsg
          });
        }
      },
      fail: function (err) {
        that.setData({
          isLoading: false,
          hasContent: false,
          emptyText: '网络错误，请稍后再试！'
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
    this.loadData(this.data.section.id);
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