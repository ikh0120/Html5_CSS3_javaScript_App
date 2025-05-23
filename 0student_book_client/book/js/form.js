//전역변수 선언하기
const API_BASE_URL = "http://localhost:8080";

//DOM 엘리먼트 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");

//Document Load 이벤트 처리하기 //DOMContentLoaded 이벤트 발생 시 loadBook() 실행하기
//DOMContentLoaded: HTML 문서의 모든 DOM 요소가 완전히 파싱 된 상태
document.addEventListener("DOMContentLoaded", function() {
    console.log("페이지 로드 완료");
    loadBooks();
});

//Form Submit 이벤트 처리하기
bookForm.addEventListener("submit", function(event){
    //입력 항목 검증 전 기본 설정 된 event 동작하지 않기 위해 event.preventDefault() 설정
    event.preventDefault();
    console.log("Form 제출 됨...");

    //FormData 객체 생성하기 <form> 엘리먼트 객체로 변환
    const bookFormData = new FormData(bookForm);
    // bookFormData.forEach((value, key) => {
    //     console.log(key + '=' + value);
    // });

    //사용자 정의 Book 객체 생성 (공백 제거)
    const bookData = {
        title: bookFormData.get("title").trim(),
        author: bookFormData.get("author").trim(),
        isbn: bookFormData.get("isbn").trim(),
        price: bookFormData.get("price") ? parseInt(bookFormData.get("price")) : null,
        publishDate: bookFormData.get("publishDate") || null,
        detailRequest: {
            description: bookFormData.get("description").trim() || null,
            language: bookFormData.get("language").trim() || null,
            pageCount: bookFormData.get("pageCount") ? parseInt(bookFormData.get("pageCount")) : null,
            publisher: bookFormData.get("publisher").trim() || null,
            coverImageUrl: bookFormData.get("coverImageUrl").trim() || null,
            edition: bookFormData.get("edition").trim() || null,
        }
    };

    //유효성 체크하기
    if(!validateBook(bookData)) {
        return ; //검증 실패하면 반환하기
    }
    //유효한 데이터 출력하기
    console.log("유효한 데이터: ", bookData);
});

//데이터 유효성을 체크하는 함수
function validateBook(book) {
    //필수 필드 검사
    if(!book.title) {
        alert("제목을 입력해주세요.");
        return false;
    }

    if(!book.author) {
        alert("저자를 입력해주세요.");
        return false;
    }

    if(!book.isbn) {
        alert("ISBN을 입력해주세요.");
        return false;
    }

    //ISBN 형식 검사 (기본적인 영/숫자 조합)
    const isbnPattern = /^[0-9X-]+$/;
    if(!isbnPattern.test(book.isbn)) {
        alert("올바른 ISBN 형식이 아닙니다. (숫자와 X, -만 허용)");
        return false;
    }

    if(!book.price) {
        alert("가격을 입력해주세요");
        return false;
    }

    //가격 유효성 검사
    if(book.price !== null && book.price < 0) {
        alert("가격은 0 이상이어야 합니다.");
        return false;
    }

    if(!book.publishDate){
        alert("출판일을 입력해주세요.")
        return false;
    }

    if(!book.detailRequest.language) {
        alert("언어를 입력해주세요");
        return false;
    }

    if(!book.detailRequest.pageCount){
        alert("페이지 수를 입력해주세요.");
        return false;
    }

    // 페이지 수 유효성 검사
    if (book.detailRequest.pageCount < 0) {
        alert('페이지 수는 0 이상이어야 합니다.');
        return false;
    }

    if(!book.detailRequest.publisher){
        alert('출판사를 입력해주세요.')
        return false;
    }

    // URL 형식 검사 (입력된 경우에만)
    if (book.detailRequest.coverImageUrl && !isValidUrl(book.detailRequest.coverImageUrl)) {
        alert('올바른 이미지 URL 형식이 아닙니다.');
        return false;
    }

    return true;
} //validateBook

// URL 유효성 검사
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    }
    catch(_){ //오류 로그는 필요없고 실패 여부만 판단할 때 _를 사용
        return false;
    }
}

//책 목록을 로드하는 메서드
function loadBooks() {
    console.log("책 정보 로드 중...");
}