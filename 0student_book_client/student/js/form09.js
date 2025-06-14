//전역변수 선언
const API_BASE_URL = "http://localhost:8080";
//현재 수정중인 학생 ID
let editingStudentId = null;

//DOM 엘리먼트 가져오기
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const cancelButton = studentForm.querySelector(".cancel-btn");
const submitButton = studentForm.querySelector('button[type="submit"]');

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
        },
    };

    //유효성 체크하기
    if (!validateStudent(studentData)) {
        //검증 체크 실패하면 리턴하기
        return;
    }
    //유효한 데이터 출력하기
    // console.log(studentData);

    //현재 수정중인 학생 ID가 있으면
    if (editingStudentId) {
        //서버로 Student 수정 요청하기
        updateStudent(editingStudentId, studentData);
    } else {
        //서버로 Student 등록 요청하기
        createStudent(studentData);
    }
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
    const studentNumberPattern = /^S\d{5}$/;
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
} //validateStudent

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

//학생목록을 로드하는 함수
function loadStudents() {
    console.log("학생 목록 로드 중.....");
    fetch(`${API_BASE_URL}/api/students`) //Promise
        .then((response) => {
            if (!response.ok) {
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
    //[]: students
    console.log(students);

    //id="studentTableBody"인 태그 초기화
    studentTableBody.innerHTML = "";

    students.forEach((student) => {
        //{}: student
        //<tr> 엘리먼트를 생성하기
        const row = document.createElement("tr");

        //<tr>의 content을 동적으로 생성
        row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.studentNumber}</td>
                    <td>${student.detail ? student.detail.address : "-"}</td>
                    <td>${student.detail ? student.detail.phoneNumber : "-"
            }</td>
                    <td>${student.detail?.email ?? "-"}</td>
                    <td>${student.detail ? student.detail.dateOfBirth || "-" : "-"
            }</td>
                    <td>
                        <button class="edit-btn" onclick="editStudent(${student.id
            })">수정</button>
                        <button class="delete-btn" onclick="deleteStudent(${student.id
            })">삭제</button>
                    </td>
                `;
        //<tbody>의 아래에 <tr>을 추가시켜 준다.
        studentTableBody.appendChild(row);
    });
}

//Student 등록 함수
function createStudent(studentData) {
    fetch(`${API_BASE_URL}/api/students`, {
        //Promise<Response>
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData), //Object => JSON
    }) //Promise<Response>를 then 절로 넘김
        .then(async (response) => {
            if (!response.ok) {
                //staus code가 200 ok가 아니라면
                //응답 본문을 읽어서 에러 메세지 추출
                const errorData = await response.json();
                //status code와 message를 확인
                if (response.status === 409) {
                    //409 Conflict: 서버가 요청을 이해했지만 현재 상태와 충돌이 발생했을 때(예: 중복 데이터)
                    //중복 오류 처리
                    throw new Error(errorData.message || "중복되는 정보가 존재합니다.");
                } else {
                    //409 Conflict 오류가 아닌 다른 오류가 생기면
                    throw new Error(errorData.message || "학생 등록에 실패했습니다. ");
                }
            }
            //status code가 200 ok라면
            return response.json(); //다음 then으로 넘김김
        })
        .then((result) => {
            alert("학생이 성공적으로 등록되었습니다.");
            // //등록 후 초기화
            // studentForm.reset();
            resetForm();
            //목록 새로고침
            loadStudents();
        })
        .catch((error) => {
            console.log("Error: ", error);
            alert(error.message);
        });
}

//학생 삭제 함수
function deleteStudent(studentId) {
    if (!confirm(`ID = ${studentId}인 학생을 정말로 삭제하겠습니까?`)) {
        return;
    }
    console.log("삭제처리...");
    fetch(`${API_BASE_URL}/api/students/${studentId}`, {
        method: "DELETE",
    })
        .then(async (response) => {
            if (!response.ok) {
                //staus code가 200 ok가 아니라면
                //응답 본문을 읽어서 에러 메세지 추출
                const errorData = await response.json();
                //status code와 message를 확인
                if (response.status === 404) {
                    throw new Error(errorData.message || "존재하지 않는 학생입니다.");
                } else {
                    throw new Error(errorData.message || "학생 삭제에 실패했습니다. ");
                }
            }

            alert("학생이 성공적으로 삭제되었습니다.");
            //목록 새로고침
            loadStudents();
        })
        .catch((error) => {
            console.log("Error: ", error);
            alert(error.message);
        });
}

//학생 정보 수정 전 데이터 로드하는 함수
function editStudent(studentId) {
    fetch(`${API_BASE_URL}/api/students/${studentId}`)
        .then(async (response) => {
            if (!response.ok) {
                //staus code가 200 ok가 아니라면
                //응답 본문을 읽어서 에러 메세지 추출
                const errorData = await response.json();
                //status code와 message를 확인
                if (response.status === 404) {
                    throw new Error(errorData.message || "존재하지 않는 학생입니다.");
                }
            }

            return response.json();
        })
        .then((student) => {
            //Form에 데이터 채우기
            studentForm.name.value = student.name;
            studentForm.studentNumber.value = student.studentNumber;
            if (student.detail) {
                studentForm.address.value = student.detail.address;
                studentForm.phoneNumber.value = student.detail.phoneNumber;
                studentForm.email.value = student.detail.email;
                studentForm.dateOfBirth.value = student.detail.dateOfBirth || "";
            }
            //수정 Mode 설정
            editingStudentId = studentId;
            //버튼의 타이틀을 학생 등록 => 학생 수정으로 변경
            submitButton.textContent = "학생 수정";
            //취소 버튼 활성화
            cancelButton.style.display = "inline-block";
        })
        .catch((error) => {
            console.log("Error: ", error);
            alert(error.message);
        });
}

//수정 모드에서 등록 모드로 초기화 하는 메서드
function resetForm() {
    //form 초기화
    studentForm.reset();
    //수정모드 해제
    editingStudentId = null;
    //title 변경
    submitButton.textContent = "학생 등록";
    //취소버튼 사라짐
    cancelButton.style.display = "none";
}

//학생 수정 처리하는 함수
function updateStudent(studentId, studentData) {
    fetch(`${API_BASE_URL}/api/students/${studentId}`, {
        //Promise<Response>
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData), //Object => JSON
    }) //Promise<Response>를 then 절로 넘김
        .then(async (response) => {
            if (!response.ok) {
                //staus code가 200 ok가 아니라면
                //응답 본문을 읽어서 에러 메세지 추출
                const errorData = await response.json();
                //status code와 message를 확인
                if (response.status === 409) {
                    //409 Conflict: 서버가 요청을 이해했지만 현재 상태와 충돌이 발생했을 때(예: 중복 데이터)
                    //중복 오류 처리
                    throw new Error(errorData.message || "중복되는 정보가 존재합니다.");
                } else {
                    //409 Conflict 오류가 아닌 다른 오류가 생기면
                    throw new Error(errorData.message || "학생 수정에 실패했습니다. ");
                }
            }
            //status code가 200 ok라면
            return response.json(); //다음 then으로 넘김김
        })
        .then((result) => {
            alert("학생이 성공적으로 수정되었습니다.");
            //등록모드로 초기화화
            resetForm();
            //목록 새로고침
            loadStudents();
        })
        .catch((error) => {
            console.log("Error: ", error);
            alert(error.message);
        });
}
