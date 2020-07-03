const Valid = {
    isEmpty : function(data, label)  {
        if(!data){
            alert(`${label}은(는) 필수입력입니다.`);
            return true;
        }
        return false;
    },

    maxLength : function(event, max, label) {
        if(event.target.value.length > max){
            alert(`${label}은(는) 최대 ${max}까지 입력할 수 있습니다.`);
            event.target.value = event.target.value.substring(0, max);
            return;
        }
    },

    onlyNumber: function(event, max, label) {
        let val = event.target.value;
        const regexp = /^[0-9\b]+$/
        if (val === '' || regexp.test(val)) {
            if(event.target.value.length > max){
                alert(`${label}은(는) 최대 ${max}자리까지 입력할 수 있습니다.`);
                event.target.value = event.target.value.substring(0, max);
                return;
            }
            event.target.value = val;
        }else{
            alert('숫자만 입력 가능합니다.');            
            event.target.value = '';
        }
    },

    onlyCurrency: function(event, max, label) {
        let val = event.target.value;
        const regexp = /^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]{1,2})?$/
        if (val === '' || regexp.test(val)) {
            if(event.target.value.length > max){
                alert(`${label}은(는) 최대 ${max}자리까지 입력할 수 있습니다.`);
                event.target.value = event.target.value.substring(0, max);
                return;
            }
            event.target.value = val;
        }else{
            alert('숫자만 입력 가능합니다.');            
            event.target.value = '';
        }
    }
}


export default Valid;