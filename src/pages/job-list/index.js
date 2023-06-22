import * as React from 'react';
import ResponsiveAppBar from "../../components/navbarCustom"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./index.css";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button2 from 'react-bootstrap/Button';
import Moment from 'moment';

const Home = () => {

    useEffect(() => {
        getAllJob();
    },[]);

    const [allJob, setAllJob] = useState([]);
    const [maxPage, setMaxPage] = useState("");
    const [typeJob, setTypeJob] = useState("");
    const [companyJob, setCompanyJob] = useState("");
    const [locationJob, setLocationJob] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [flag, setFlag] = useState(false);
    const [page, setPage] = useState(1);


    const handleChange = (event, value) => {
        if (flag === false) {
            axios.get(`http://127.0.0.1:8000/api/job/${value}`)
            .then((res) => {
                setAllJob(res.data.data)
                setMaxPage(res.data.maxPage)
                setPage(value);
            }).catch((err) => {
                console.log(err)
            });
        }
        else if (flag === true) {
            axios.post(`http://127.0.0.1:8000/api/job-filter/${value}`, {
                type: typeJob,
                date: selectedDate,
                location: locationJob,
                company: companyJob,
            })
            .then((res) => {
                setAllJob(res.data.data)
                setMaxPage(res.data.maxPage)
                setPage(value);
            }).catch((err) => {
                console.log(err)
            });
        }
        
    };
    
    const getAllJob = async () => {
        axios.get(`http://127.0.0.1:8000/api/job/`)
        .then((res) => {
            setAllJob(res.data.data)
            setMaxPage(res.data.maxPage)
        }).catch((err) => {
            console.log(err)
        });
    }

    const jobFilter = async () => {
        axios.post(`http://127.0.0.1:8000/api/job-filter/`, {
            type: typeJob,
            date: selectedDate,
            location: locationJob,
            company: companyJob,
        })
        .then((res) => {
            setAllJob(res.data.data)
            setMaxPage(res.data.maxPage)
            setFlag(true)
        }).catch((err) => {
            console.log(err)
        });
    }


    return (
        <div>
            <ResponsiveAppBar />
            <br />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} columns={{ xs: 10 }}>
                    <Grid item xs={2}>
                        <Form.Select aria-label="Type Job" className='customSelect' onChange={(e) => setTypeJob(e.target.value)}>
                            <option value={null}>Select Type Job</option>
                            <option value="programmer">Programmer</option>
                            <option value="data">Data</option>
                            <option value="network">Network</option>
                            <option value="cyber security">Cyber Security</option>
                        </Form.Select>
                    </Grid>

                    <Grid item xs={2}>
                        <Form.Control
                            type="date"
                            name="duedate"
                            placeholder="Due date"
                            value={selectedDate}
                            style={{color:'#FF1F57'}}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <input type="text" class="form-control" placeholder="Company" style={{color:'#FF1F57'}} onChange={(e) => setCompanyJob(e.target.value)}/>
                    </Grid>

                    <Grid item xs={2}>
                        <input type="text" class="form-control" placeholder="Location" style={{color:'#FF1F57'}} onChange={(e) => setLocationJob(e.target.value)}/>
                    </Grid>

                    <Grid item xs={2}>
                        <Button2 onClick={jobFilter}>Filter</Button2>{' '}
                    </Grid>
                </Grid>
            </Box>
            <br />
            <h2 style={{textAlign: 'center', color: '#FF1F57'}}>Job List</h2>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} columns={{ xs: 8 }}>
                    {allJob.map((job, index) => {
                        return (
                        <Grid item xs={4}>
                            <Card sx={{ minWidth: 275 , backgroundColor: 'white'}}>
                                <CardContent>
                                    <a href={job.link} style={{textDecoration: 'none', color: '#FFAC42', fontWeight: 'bold'}}>
                                        {job.title}
                                    </a>
                                    <br />
                                    <Typography variant="h7" style={{color: '#FF1F57'}}>
                                        {job.company}
                                    </Typography>
                                    <br />
                                    <br />
                                    <Typography variant="p" style={{color: '#333333'}}>
                                        {job.location}
                                    </Typography>
                                    <br />
                                    <Typography variant="p" style={{color: '#333333'}}>
                                        {new Date(job.date).toISOString().split('T')[0]}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button style={{color: '#FF1F57'}} size="small">{job.source}</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        )
                    })}
                </Grid>
            </Box>

            <br />
            <br />

            <Stack alignItems="center" style={{backgroundColor: '#FFAC42'}}>
                <Pagination count={maxPage} defaultPage={1} page={page} onChange={handleChange} color='error' size="large" />
            </Stack>

        </div>
    )

};

export default Home;