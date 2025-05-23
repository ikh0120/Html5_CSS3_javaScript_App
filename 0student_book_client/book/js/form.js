//전역변수 선언하기
const API_BASE_URL = "http://localhost:8080";

//DOM 엘리먼트 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");

//Document Load 이벤트 처리하기 //DOMContentLoaded 이벤트 발생 시 loadBook() 실행하기
document.addEventListener("DOMContentLoaded", function() {
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
        price: parseInt(bookFormData.get("price")),
        publishDate: bookFormData.get("publishDate"),
        description: bookFormData.get("description").trim(),
        language: bookFormData.get("language").trim(),
        pageCount: parseInt(bookFormData.get("pageCount")),
        publisher: bookFormData.get("publisher").trim(),
        coverImageUrl: bookFormData.get("coverImageUrl").trim(),
        edition: bookFormData.get("edition").trim(),
    };

    //유효성 체크하기
    if(!validateBook(bookData)) {
        return ; //검증 실패하면 반환하기
    }
    //유효한 데이터 출력하기
    console.log(bookData);
});

//데이터 유효성을 체크하는 함수
function validateBook(book) {
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
    
    if(!book.price) {
        alert("가격을 입력해주세요.");
        return false;
    }

    if(!book.publishDate) {
        alert("출판일을 입력해주세요.");
        return false;
    }

    if(!book.description) {
        alert("책 정보를 입력해주세요.");
        return false;
    }

    if(!book.language) {
        alert("책 언어를 입력해주세요.");
        return false;
    }

    if(!book.pageCount) {
        alert("페이지수를 입력해주세요.");
        return false;
    }

    if(!book.publisher) {
        alert("출판사를 입력해주세요.");
        return false;
    }

    if(!book.coverImageUrl) {
        alert("표지 URL를 입력해주세요.");
        return false;
    }

    if(!book.edition) {
        alert("에디션을 입력해주세요.");
        return false;
    }

    return true;
} //validateBook

//책 목록을 로드하는 메서드
function loadBooks() {
    console.log("책 정보 로드 중...");
}