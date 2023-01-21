import "./model.css";

function Model({ setmodel, value, setvalue,sendEther }) {
    return (
        <div className='module_container'>
            <div className='module_box'>
                <div className="fix" />

                <div className='module_fix'>


                    <div className="inner_module">
                        <h1 className='inner_module1'>Enter  value 🚀</h1>
                        <form className='inner_module2' onSubmit={(e) => {
                            e.preventDefault();
                        }}>
                            <input type={'text'} value={value}
                                placeholder="Enter Ether value"
                                onChange={e => {
                                    setvalue(e.target.value);
                                }} className='' />
                            <div className='pt-5'>
                                <button className='' type={"Submit"}
                                    onClick={sendEther}
                                >Done</button>
                                <button className="" onClick={() => {
                                    setmodel(false)
                                }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>





        </div>
    )
}

export default Model;