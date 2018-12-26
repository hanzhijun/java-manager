import request from '@/utils/request'
import Mock from 'mockjs'

export function fetchList(query) {
  return new Promise((resolve, reject) => {
    const List = []
    const count = 20

    for (let i = 0; i < count; i++) {
      List.push(Mock.mock({
        order_no: '@guid()',
        timestamp: +Mock.Random.date('T'),
        username: '@name()',
        price: '@float(1000, 15000, 0, 2)',
        'status|1': ['success', 'pending']
      }))
    }
    resolve({ data: {
      total: List.length,
      items: List
    }})
  })
}
