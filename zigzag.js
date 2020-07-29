//Task 2 - Tree Arrangement

//Assumptions :
// We can change position of the array
convertToZigZag = function(arr) {
    let n = arr.length

    if(n <= 2) {
        return
    }

    let flag = true

    for(var i=0; i <= (n-1); i++) {
        if (flag) {
            // If we have a situation like a > b > c
            if (arr[i] > arr[i+1]) {
                var temp = arr[i]
                arr[i] = arr[i+1]
                arr[i+1] = temp
            }
        } else {
            // If we have a situation like a < b < c
            if (arr[i] < arr[i+1]) {
                var temp = arr[i]
                arr[i] = arr[i+1]
                arr[i+1] = temp
            }
        }
        flag = !flag
    }

    // result calculation
    let ans = 0
    for(var i = 0 ; i < n - 1 ; i++)
    {
        if(arr[i] == arr[i + 1]) {
            ans += 1
        }
    }
    return ans
}

const data = [1,5,3,3,3,3]
let result = convertToZigZag(data)
console.log(result)