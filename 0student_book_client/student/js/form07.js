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
        detailRequest: {
            address: stuformData.get("address").trim(),
            phoneNumber: stuformData.get("phoneNumber").trim(),
            email: stuformData.get("email").trim(),
            dateOfBirth: stuformData.get("dateOfBirth") || null, //값이 없으면 null
        }
    };

    //유효성 체크하기
    if(!validateStudent(studentData)) {
        //검증 체크 실패하면 리턴하기
        return;
    };
    //유효한 데이터 출력하기
    // console.log(studentData);
    
    //서버로 Student 등록 요청하기
    createStudent(studentData);

});

// JSON.stringify(obj) => 자바스크립트 객체(Object)를 JSON 문자열로 변환
// JSON.parse(jsonString) => JSON 문자열을 자바스크립트 객체(Object)로 변환
// async/await는 JavaScript에서 비동기 코드를 동기식처럼 작성할 수 있게 해주는 문법임
/* 
 *   * 1. Synchronous (동기)
 *       - 코드가 위에서 아래로 순차적으로 실행
 *       - 앞의 작업이 끝나야 다음 작업이 실행
 *   * 2. Asynchronous (비동기)
 *       - 기다리지 않고, 다음 코드를 먼저 실행
 *       - 나중에 결과가 준비되면 콜백, Promise, async/await을 통해 처리
 *       - 주로 시간이 오래 걸리는 작업(API 호출, 파일 읽기 등)에 사용
 *   * 3. Promise
 *       - 비동기 작업을 보다 깔끔하고 예측 가능하게 처리할 수 있는 객체
 *       - pending(대기중) → fulfilled(이행됨, 성공) or rejected(거부됨, 실패) 상태를 가짐.
 *       - .then()이나 .catch()로 결과를 처리
 *   * 4. async/await
 *       - Promise를 더 간단하게 쓰기 위한 문법
 *       - async 함수 안에서만 await 사용 가능
 *       - await은 Promise가 끝날 때까지 기다림 (코드를 동기처럼 읽기 쉽게 만듦)
 */
//Student 등록 함수
function createStudent(studentData) {
    fetch(`${API_BASE_URL}/api/students`, {     //Promise
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(studentData)   //Object => JSON
    })
    .then(async (response) => {
        if(!response.ok) {
            //응답 본문을 읽어서 에러 메세지 추출
            const errorData = await response.json();
            //status code와 message를 확인
            if(response.status === 409) {   //409 Conflict: 서버가 요청을 이해했지만 현재 상태와 충돌이 발생했을 때(예: 중복 데이터)
                //중복 오류 처리
                throw new Error(errorData.message || '중복되는 정보가 존재합니다.');
            }else {     //409 Conflict 오류가 아닌 다른 오류가 생기면
                throw new Error(errorData.message || '학생 등록에 실패했습니다. ')
            }
        }
        return response.json();
    })
    .then((result) => {
        alert("학생이 성공적으로 등록되었습니다.");
        //등록 후 초기화
        studentForm.reset();
        //목록 새로고침
        loadStudents();
    })
    .catch((error) => {
        console.log('Error: ', error);
        alert(error.message);
    });
}

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

    if (!student.detailRequest.address) {
        alert("주소를 입력해주세요.");
        return false;
    }

    if (!student.detailRequest.phoneNumber) {
        alert("전화번호를 입력해주세요.");
        return false;
    }

    if (!student.detailRequest.email) {
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
    if (!phonePattern.test(student.detailRequest.phoneNumber)) {
        alert("올바른 전화번호 형식이 아닙니다.");
        return false;
    }

    // 이메일 형식 검사 (입력된 경우에만)
    if (student.email && !isValidEmail(student.detailRequest.email)) {
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

function renderStudentTable(students) {     //[]: students
    console.log(students);

    //id="studentTableBody"인 태그 초기화
    studentTableBody.innerHTML = "";

    students.forEach((student) => {     //{}: student
        //<tr> 엘리먼트를 생성하기
        const row = document.createElement("tr");
        
        //<tr>의 content을 동적으로 생성
        row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.studentNumber}</td>
                    <td>${student.detail ? student.detail.address : "-"}</td>
                    <td>${student.detail ? student.detail.phoneNumber : "-"}</td>
                    <td>${student.detail?.email ?? "-"}</td>
                    <td>${student.detail ? student.detail.dateOfBirth || "-" : "-"}</td>
                    <td>
                        <button class="edit-btn" onclick="editStudent(${student.id})">수정</button>
                        <button class="delete-btn" onclick="deleteStudent(${student.id})">삭제</button>
                    </td>
                `;
        //<tbody>의 아래에 <tr>을 추가시켜 준다.
        studentTableBody.appendChild(row);
    });
}
