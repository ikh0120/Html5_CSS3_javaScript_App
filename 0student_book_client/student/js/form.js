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
    stuformData.forEach((value, key) => {
        console.log(key + '=' + value);
    });

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
    }


});

//데이터 유효성을 체크하는 함수
function validationStudent(student) {
    
}

//학생목록을 로드하는 함수
function loadStudents() {
    console.log("학생 목록 로드 중.....");
}
