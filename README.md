#### 주요 기능: 
* 학생(도서) 등록 
    - (이름, 학번, 주소, 전화번호, 이메일, 생년월일)
* 학생(도서) 목록 조회
* 학생(도서) 정보 수정
* 학생(도서) 삭제
* 입력 데이터 유효성 검사
* Ajax 통신을 통한 REST API 호출

#### 사용된 기술:
* HTML5: 구조적인 마크업
* CSS3: 반응형 레이아웃과 스타일링
* JavaScript (ES6+): 동작 기능과 Ajax API 통신

#### 주요 특징: 
* 점진적 개발 방식으로 단계별 완성
* 에러 처리 및 사용자 피드백
* 로딩 상태 표시
* 수정 모드와 등록 모드 전환
* 입력 필드별 실시간 유효성 검사(JavaScript)

### 각 Step 별 기능:
* step01
    * - html page 작성
* step02 
    * - form 내부의 input 과 table 에 CSS 추가
* step03 
    * - form.css 파일로 분리하기
    * - form 내부의 input에 form-group, form-grid css 추가
    * - form.css 에 form-group, form-grid 클래스 추가하기
* step04
    * - javascript 코드 작성하기 시작
    * - Document Load Event 핸들링 하기
    * - Form Submit Event 핸들링 하기
    * - 사용자가 입력한 데이터를 Form Data 검증하기
* step05
    * - javascript code를 form.js 파일로 분리하기
    * - 입력한 데이터를 검증하는 validate() 함수 구현하기
* step06
    * - GET /api/students 서버와 통신하는 loadStudents() 구현 fetch 함수 사용
    * - renderStudentTable() 구현 table 목록을 동적으로 출력하기
    * - `` back tick Template Literals , Arrow function (화살표 함수)
    * - 주석 추가
        * - [truthy/falsy 개념 정리]
        * - ?. , ??, || 개념 정리
* step07
    * - studentData 객체 구조 변경하기 및 validate() 메서드 수정
    * - POST api/student 서버와 통신하는 createStudent() 메서드 구현
        * - JSON.stringify(Object) => 자바스크립트 객체(Object)를 JSON 문자열로 변환
        * - JSON.parse(JSON) => JSON 문자열을 자바스크립트 객체(Object)로 변환
        * - async/await는 JavaScript에서 비동기 코드를 동기식처럼 작성할 수 있게 해주는 문법임
            * - async 함수: 함수 앞에 async 키워드를 붙이면 해당 함수는 항상 Promise를 반환
            * - await 표현식: await 키워드는 Promise가 처리될 때 까지 함수 실행을 일시 중지
                * [동기(Synchronous)] : 한 작업이 끝나야 다음 작업이 시작됨
                * [비동기(Asynchronous)] : 기다리지 않고 다음 작업부터 실행, 결과는 나중에 처리
                * [Promise] : 비동기 작업을 처리하기 위한 객체, then/catch로 결과 처리
                * [async/await] : Promise를 더 쉽게 사용하기 위한 문법, 동기 코드처럼 작성 가능
* step08
    * - DELETE api/student/1 서버와 통신하는 deleteStudent() 메서드 구현 fetch 함수 사용
* step09
    * - student 수정하기 전에 데이터 조회 먼저하기
    * - GET api/students/1 student 조회하는 editStudent() 메서드 구현
    * - 수정, 삭제 버튼의 스타일 추가하기 
    * - 수정 모드일 때 취소 버튼 보여주고, resetForm() 메서드 구현하고 연결하기
    * - PUT api/students/1 student 수정하는 updateStudent() 메서드 구현
* step10
    * - 성공 및 실패 메세지를 alert() 대신 formError <span>에 보여주기
    * - showSuccess() / showError() / clearMessage() 메서드 추가
    * - loadStudents() 목록 불러오기 실패한 경우에 처리

