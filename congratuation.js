const generateRandom = function(begin, end){
    const max = Math.max(begin, end);
    const min = Math.min(begin, end);
    const range = max - min;
    return Math.random() * range + min;
};
const generateRandomInteger = function(begin, end){
    return parseInt(generateRandom(begin, end));
};

$(function(){
    
    setInterval(()=>{

        //.firecracker 추가
        const firecracker = $("<div>").addClass("firecracker");
        
        //초기 스타일 설정
        firecracker.css("font-size", generateRandomInteger(5, 30)+"px")
                        .css("left", generateRandomInteger(0, 100)+"%")
                        .css("top", "110%");

        $(".festival").append(firecracker);

        //랜덤값 설정(애니메이션을 위해)
        const top = generateRandomInteger(5, 95);
        const left = generateRandomInteger(5, 95);
        const duration = generateRandomInteger(1000, 4000);

        //애니메이션 설정
        firecracker.animate({
            top:top+"%",
            left:left+"%"
        }, duration, ()=>{
            //폭발하는 모션을 위한 클래스 추가
            firecracker.addClass("boom");

            //폭발모션은 지속시간이 2초이므로 2.5초 후 태그 제거
            setTimeout(()=>{
                firecracker.remove();
            }, 1000);
        });

    }, 250);//delay를 조절하면 폭죽 발사 속도 조절 가능(빠를 수록 시스템에 무리감)

});