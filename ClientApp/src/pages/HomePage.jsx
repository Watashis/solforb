import React, { Component, useState, useEffect } from 'react';
import Table from '../components/Table';
import Filters from '../components/Filters'
import * as Api from '../api';

export function HomePage() {
  const [orders, setOrders] = useState([]);
  const [sortBy, setSortBy] = useState("provider");
  const [sort, setSort] = useState(1);
  const [_prevDate, _nextDate] = Api.getDates();
  const [prevDate, setPrevDate] = useState(_prevDate);
  const [nextDate, setNextDate] = useState(_nextDate);
  const [filters, setFilters] = useState([]);
  useEffect(() => {
    fetch();
  }, []);
  const fetch = async (_sortBy = "", _sort = "", _prevDate = "", _nextDate = "", _filters = []) => {
    _sortBy = _sortBy == "" ? sortBy : _sortBy;
    _sort = _sort == "" ? sort : _sort;
    _prevDate = _prevDate == "" ? prevDate : _prevDate;
    _nextDate = _nextDate == "" ? nextDate : _nextDate;
    _filters = _filters == "" ? filters : _filters;
    setOrders(await Api.fetchOrders(_sortBy, _sort, _prevDate, _nextDate, _filters));
  }
  const Hooks = {
    setSortBy: setSortBy,
    getSortBy: () => sortBy,
    setSort: setSort,
    getSort: () => sort,
    update: fetch,
    setPrevDate: setPrevDate,
    setNextDate: setNextDate,
    setFilters: setFilters
  }
  return <>
    <Filters Hooks={Hooks} prevDate={prevDate} nextDate={nextDate}></Filters>
    <Table Hooks={Hooks}>{orders}</Table>
  </>
}