import originJSONP from 'jsonp'

export default function jsonp (url:string, data:Record<string, any>, option?:Record<string, any>):Promise<any> {
	// 拼接url时判断是否已有问号
	url += (url.indexOf('?') > -1) ? '&' : '?' + param(data)
	return new Promise((resolve, reject) => {
		console.log(data)
		originJSONP(url, option, (err, data) => {
			// 如果没错误，就resolve(data)
			if (!err) {
				resolve(data)
			} else {
				reject(err)
			}
		})
	})
}

// 将data（参数对象）封装到url里面
function param (data:Record<string, any>) {
	let url = ''
	for (const i in data) {
		const value = data[i] !== undefined ? data[i] : ''
		// url拼接参数，参数之间用&隔开
		url += `&${i}=${encodeURIComponent(value)}`
	}
	// 如果url有data，将第一个"&"删掉
	return url ? url.substring(1) : ''
}
