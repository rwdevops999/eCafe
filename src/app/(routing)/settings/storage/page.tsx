import PageBreadCrumbs from '@/components/ecafe/page-bread-crumbs';
import PageTitle from '@/components/ecafe/page-title';
import React from 'react'
import SettingsStorage from './components/settings-storage';
import SettingsHistory from './components/settings-history';

const Storage = () => {
  return (
    <>
      <PageBreadCrumbs crumbs={[{name: "ecafé", url: "/"}, {name: "settings"}, {name: "storage", url: "/settings/storage"}]} />
      <div className='w-[99%] min-h-[97%]'>
        <div className="flex space-x-2 items-center">
          <PageTitle className="m-2" title={`Storage`} />
        </div>
        <div className="space-y-2">
          <SettingsStorage />
          <SettingsHistory />
        </div>
      </div>
      </>
)
}

export default Storage;