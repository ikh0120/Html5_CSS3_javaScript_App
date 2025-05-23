//전역변수 선언
const API_BASE_URL = "http://localhost:8080";

//DOM 엘리먼트 가져오기
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

//Document Load 이벤트 처리하기 //DOMContentLoaded라는 이벤트가 발생하면 loadStudents() 메서드를 실행해라
document.addEventListener("DOMContentLoaded", function () {
    loadStudents();
});

//Form Submit 이벤트 처리하기
studentForm.addEventListener("submit", function (event) {
    //기본으로 설정된 Event가 동작하지 않도록 하기 위함  //입력항목 검증 후 기본 Event가 동작하기 위해 잠깐 멈춤
    event.preventDefault();
    console.log("Form 제출 되었음...");

    //FormData 객체 생성 <form> 엘리먼트를 객체로 변환 
    const stuformData = new FormData(studentForm);
    // stuformData.forEach((value, key) => {
    //     console.log(key + '=' + value);
    // });

    //사용자 정의 Student 객체 생성 (공백 제거)
    const studentData = {
        name: stuformData.get("name").trim(),
        studentNumber: stuformData.get("studentNumber").trim(),
        address: stuformData.get("address").trim(),
        phoneNumber: stuformData.get("phoneNumber").trim(),
        email: stuformData.get("email").trim(),
        dateOfBirth: stuformData.get("dateOfBirth"),
    };

    //유효성 체크하기
    if(!validateStudent(studentData)) {
        //검증 체크 실패하면 리턴하기
        return;
    };
    //유효한 데이터 출력하기
    console.log(studentData);

});

//데이터 유효성을 체크하는 함수
function validateStudent(student) {
    if (!student.name) {
        alert("이름을 입력해주세요.");
        return false;
    }


    if (!student.studentNumber) {
        alert("학번을 입력해주세요.");
        return false;
    }

    if (!student.address) {
        alert("주소를 입력해주세요.");
        return false;
    }

    if (!student.phoneNumber) {
        alert("전화번호를 입력해주세요.");
        return false;
    }

    if (!student.email) {
        alert("이메일을 입력해주세요.");
        return false;
    }
    // 학번 형식 검사 (예: 영문과 숫자 조합)
    // const studentNumberPattern = /^[A-Za-z0-9]+$/;
    const studentNumberPattern = /^s\d{5}$/;
    if (!studentNumberPattern.test(student.studentNumber)) {
        alert("학번은 영문과 숫자만 입력 가능합니다.");
        return false;
    }

    // 전화번호 형식 검사
    const phonePattern = /^[0-9-\s]+$/;
    if (!phonePattern.test(student.phoneNumber)) {
        alert("올바른 전화번호 형식이 아닙니다.");
        return false;
    }

    // 이메일 형식 검사 (입력된 경우에만)
    if (student.email && !isValidEmail(student.email)) {
        alert("올바른 이메일 형식이 아닙니다.");
        return false;
    }

    return true;
}//validateStudent

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/** `` back tick Template Literals 
 * const port = 8080;
 * const domain = "mydomain";
 * const url = 'http://' + domain + ':' + port;
 * console.log(url);        => http://mydomain:8080
 * const urlBT = `http://${mydomain}:${port+1}`;    //back tick을 사용하면 줄바꿈, 연산도 자유자재로 사용 가능
 * console.log(urlBT);      => http://mydomain:8081
*/
/**Arrow function (화살표 함수)
* function add(n1,n2) {
*   return n1 + n2;
* }
* console.log(add(10,20));
* 
* const add2 = (n1,n2) => n1 + n2;
* console.log(add2(10,20));
* 
* // () 묵시적으로 return 구문을 포함한다.
* const add3 = (n1,n2) => (n1 + n2);
* console.log(add3(10,20));
* 
* const add4 = (n1,n2) => {
*   let temp = n1 + 10;
*   return temp + n2;
* }
* console.log(add4(10,20));
* 
*/
//학생목록을 로드하는 함수
function loadStudents() {
    console.log("학생 목록 로드 중.....");
    fetch(`${API_BASE_URL}/api/students`)   //Promise
    .then((response) => {
        if(!response.ok) {
            throw new Error("학생목록을 불러오는데 실패했습니다."); //에러를 던지면 catch()쪽으로 넘어감
        }
        return response.json();
    })
    .then((students) => renderStudentTable(students))
    .catch((error) => {
        console.log("Error: " + error);
        alert("학생목록을 불러오는데 실패했습니다.");
    });
}

function renderStudentTable(students) {
    console.log(students);
}
