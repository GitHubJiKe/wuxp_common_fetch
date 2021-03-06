import {isFunction, isUndefined} from "util";
import {ReqMethod} from "../enums/ReqMethod";
import {DataType} from "../enums/DataType";
import {ApiClientInterface} from "./ApiClientInterface";
import {BaseApiOptions} from "./BaseApiOptions";


/**
 * 通用api client 代理工厂
 */
export default class ApiClientProxyFactory {


    /**
     * api client 创建工厂
     * @param targetService
     * @param {ApiClientInterface} api
     * @return {any} apiClient代理对象
     */
    public static factory = (targetService: any, api: ApiClientInterface<any>): any => {
        const proxy = {};


//         value:属性的值
//         writable:如果为false，属性的值就不能被重写,只能为只读了
//         configurable:总开关，一旦为false，就不能再设置他的（value，writable，configurable）
//         enumerable:是否能在for...in循环中遍历出来或在Object.keys中列举出来。

        for (const key in targetService) {
            if (!isFunction(targetService[key])) {
                continue;
            }
            Object.defineProperty(proxy, key, {
                set: function (val) {
                    throw new Error("proxy service 无法设置新的属性");
                },
                get: function () {
                    return function (...p) {
                        const options: Array<any> = targetService[key]();
                        return api.dispatch(`/${targetService['serviceName']}/${key}`,options, ...p);
                    }
                }
            });
        }

        return proxy;
    }
}
