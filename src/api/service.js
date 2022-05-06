import axios from "axios";
import { get, throttle } from "lodash";
import util from "@/libs/util";
import store from "@/store/index";
import { errorLog, errorCreate } from "./tools";
import { MessageBox } from "element-ui";
/**
 * @description
 * 节流函数,强制下线，1分钟内触发一次，防止多接口持续调用
 * @author wsy
 * @date 2021-01-16  18:19:45
 */
const throttleLogoOut = throttle(
  (dataAxios) => {
    store.commit("ty/gray/toggle");
    MessageBox.alert("登录过期,请重新登录！", "提示", {
      confirmButtonText: "确定",
      callback: () => {
        store.dispatch("ty/account/logout").then(() => {
          store.commit("ty/gray/toggle");
        });
      },
    });
  },
  10000,
  {
    trailing: false,
  }
);
/**
 * @description 创建请求实例
 */
function createService() {
  // 创建一个 axios 实例
  const service = axios.create();
  // 请求拦截
  service.interceptors.request.use(
    (config) => config,
    (error) => {
      // 发送失败
      console.log(error);
      return Promise.reject(error);
    }
  );
  // 响应拦截
  service.interceptors.response.use(
    (response) => {
      // dataAxios 是 axios 返回数据中的 data
      const dataAxios = response.data;
      // 这个状态码是和后端约定的
      const { code } = dataAxios;
      // 根据 code 进行判断
      if (code === undefined) {
        // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 WAdmin 请求最新版本
        return dataAxios;
      } else {
        // 有 code 代表这是一个后端接口 可以进行进一步的判断
        // 目前和公司后端口头约定是字符串,以防万一强制转字符串
        switch (`${code}`) {
          case "200":
            // [ 示例 ] code === 200 代表没有错误
            return dataAxios.data;
          case "400001004":
            // [ 示例 ] code === 400001004 代表token 过期打回登录页
            throttleLogoOut(dataAxios);
            break;
          case "2":
            // [ 示例 ] code === 200 代表没有错误
            return dataAxios.data;
          case "400002001":
            // 不是正确的 code
            return errorCreate(
              `${dataAxios.msg}: ${process.env.NODE_ENV === "development"
                ? response.config.url
                : ""
              }`,
              dataAxios
            );
          case "400001002":
            // 账号密码错误
            return errorCreate(
              `${dataAxios.msg}: ${process.env.NODE_ENV === "development"
                ? response.config.url
                : ""
              }`,
              dataAxios
            );
          case "400001001":
            // 账号密码错误
            return errorCreate(
              `${dataAxios.msg}: ${process.env.NODE_ENV === "development"
                ? response.config.url
                : ""
              }`,
              dataAxios
            );
          case "xxx":
            // [ 示例 ] 其它项目和后台约定的 code
            errorCreate(
              `[ code: xxx ] ${dataAxios.msg}: ${process.env.NODE_ENV === "development"
                ? response.config.url
                : ""
              }`
            );
            break;
          default:
            // 不是正确的 code
            errorCreate(
              `${dataAxios.msg}: ${process.env.NODE_ENV === "development"
                ? response.config.url
                : ""
              }`
            );
            break;
        }
      }
    },
    (error) => {
      const status = get(error, "response.status");
      switch (status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          error.message = "未授权，请登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP版本不受支持";
          break;
        default:
          break;
      }
      errorLog(error);
      return Promise.reject(error);
    }
  );
  return service;
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequestFunction(service) {
  return function (config) {
    const token = util.cookies.get("token");
    const configDefault = {
      headers: {
        Authorization: token,
        "Content-Type": get(config, "headers.Content-Type", "application/json"),
      },
      timeout: 15000,
      baseURL: process.env.VUE_APP_API,
      data: {},
    };
    return service(Object.assign(configDefault, config));
  };
}

// 用于真实网络请求的实例和请求方法
export const service = createService();
export const request = createRequestFunction(service);