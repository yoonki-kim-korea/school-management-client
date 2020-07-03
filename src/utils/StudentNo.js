const StudentNo = {
    
    /**
     * 학번생성 할때 유효한 일련번호 목록 조회
     */
    selectValidSeqList : async (year, dpt, id) => {
        console.log(`/api/student/validseq/list 호출 year=${year}, dpt=${dpt}`);
        let emptyList = [];  
        if(!year || !dpt) return emptyList;

        let url = `/api/student/validseq/list?year=${year}&dpt=${dpt}`;
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
     * 학번생성 할때 유효한 일련번호 목록 조회
     */
    selectValidSeqWithCurrentList : async (year, dpt, id, seq) => {
        console.log(`/api/student/validseq/list 호출 year=${year}, dpt=${dpt}, seq=${seq}`);
        let emptyList = [];  
        if(!year || !dpt || !seq) return emptyList;

        let currentStudentNo = year + dpt + seq;
        let url = `/api/student/validseq/list?year=${year}&dpt=${dpt}&currentStudentNo=${currentStudentNo}`;
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

export default StudentNo;