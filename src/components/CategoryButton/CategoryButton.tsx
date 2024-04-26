import './CategoryButton.scss';
function CategoryButton(props:any){
    
    function categoryClick(e:any){
        //category click will mark this category as selected
        if(!e.currentTarget.selected){
            e.currentTarget.classList.add('selected');
            e.currentTarget.selected = true;
        }else{
            e.currentTarget.classList.remove('selected');
            e.currentTarget.selected = false;
        }
        //dispatch event to parent window to handle category selection
        window.dispatchEvent(new CustomEvent('categorySelected', {detail: {category: e.currentTarget}}));
    }
    return <a data-props={props} id={props.category.suggestion_id} data-text={props.category.text} data-subtext={props.category.subtext} onClick={categoryClick} className={`category ${props.step==1?'pill':'card'}`}><span style={{backgroundColor: `rgba(${Math.random()*155 + 100}, ${Math.random()*155 + 100}, ${Math.random()*155 + 100}, 1)`}}></span><p>{props.category.text}</p><div className="description">{props.category.subtext}</div></a>
}

export default CategoryButton;