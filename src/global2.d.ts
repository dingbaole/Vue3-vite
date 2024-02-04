interface Window {
  MenuCodeList: string[]
  getAdminData: () => {
    loginName: string
    adminId: string
    userName: string
    loginTime: number
  }
}
declare namespace API {
  interface Result<T> {
    [x: string]: any
    code: 200 | string | number
    message: string
    data: T
  }
  interface PageConfig {
    currentPage: number
    pageSize: number
  }
  type UnPromisify<T> = T extends Promise<infer U> ? U : never

  type ReturnFetchDataType<
    T extends (...arg: any) => Promise<Result<unknown>>
  > = UnPromisify<ReturnType<T>>['data']

  type ReturnFetchArrayDataType<
    T extends (...arg: any) => Promise<Result<unknown>>
  > = UnPromisify<ReturnType<T>>['data'][0]
}

// // 过滤可选类型
// interface A {
//   name?: string
//   name2: string | undefined
//   age: number
//   next: {
//     a: string
//   }
// }
// // type NonOptionalKeys<T> = { // 由于未开启空值检查, undefined 断言未生效,这样写页不太对，undefined与optional不同
// //   [k in keyof T]: undefined extends T[k] ? never : k
// // }
// type NonOptionalKeys2<T extends object> = { [P in keyof T]: {} extends Pick<T, P> ? never : P }
// type Name = Pick<A, 'name'>
// type Name2 = Pick<A, 'name2'>
// type Age = Pick<A, 'age'>
// type Next = Pick<A, 'next'>
// type SS = {} extends Name ? '1' : '0' // 这个输出结果很不理解
// type SS2 = {} extends Name2 ? '1' : '0' // 这个输出结果很不理解
// type C = NonOptionalKeys2<A>
// type B = Pick<A, NonOptionalKeys2<A>>

// // 只有当条件类型作用在泛型上，并且泛型参数为联合类型时，条件类型的结果才会分配为联合类型。
// type Diff<T, U> = T extends U ? never : T; // 找出T的差集
// type DiffU<T, U> = T extends U ? never : U; // 注意！！！只拆分extends前面的泛型，extend后面的条件类型则直接输出
// type Filter<T, U> = T extends U ? T : never; // 找出交集

// type T30 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // => "b" | "d"
// type T31 = DiffU<"aa" | "b" | "cc" | "d", "a" | "c" | "f">;  // => "a" | "c" | "f"

