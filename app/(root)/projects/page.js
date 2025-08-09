"use client"
import React, { useState } from 'react';
import AddProject from "@/components/AddProject";
import ProjectCard from "@/components/projectCard";

const Page = () => {

    return (
        <main className="">
                <AddProject/>
                <ProjectCard/>
        </main>
    );
};

export default Page;
