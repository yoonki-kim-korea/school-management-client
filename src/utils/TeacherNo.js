const TeacherNo = {
    
    /**
     * 교사번호 생성 할때 유효한 일련번호 목록 조회
     */
    selectValidSeqList : async (year, id) => {
        console.log(`/api/teacher/validseq/list 호출 year=${year}`);
        let emptyList = [];  
        if(!year) return emptyList;

        let url = `/api/teacher/validseq/list?year=${year}`;
        const response = await fetch(url);        
        const body = await response.json();
        const seqList = body.seqList;
        let nodes = '<option selected value="" />';

        seqList.map((option) => (
            nodes += `<option key='${option.seq}' value='${option.seq}'>${option.seq}</option>`
        ));
        
        try {        
            document.getElementById(id).innerHTML = nodes;
        } catch (error) {
            console.log(`id=${id},  error=${error}`);
        }
    },//selectValidSeqList
    
    /**
     * 교사번호 생성 할때 유효한 일련번호 목록 조회
     */
    selectValidSeqWithCurrentList : async (year, id, seq) => {
        console.log(`/api/teacher/validseq/list 호출 year=${year}, seq=${seq}`);
        let emptyList = [];  
        if(!year || !seq) return emptyList;

        let currentTeacherNo = year + seq;
        let url = `/api/teacher/validseq/list?year=${year}&currentTeacherNo=${currentTeacherNo}`;
        const response = await fetch(url);        
        const body = await response.json();
        const seqList = body.seqList;
        let nodes = '<option value="" />';
        
        seqList.map((option) => (
            nodes += `<option key='${option.seq}' value='${option.seq}' ${seq === option.seq ? 'selected' : ''}>${option.seq}</option>`
        ));
        
        
        try {        
            document.getElementById(id).innerHTML = nodes;
        } catch (error) {
            console.log(`id=${id}, error=${error}`);
        }
    }//selectValidSeqList
}

export default TeacherNo;