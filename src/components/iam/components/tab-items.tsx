'use client'

import PageTitle from "@/components/ecafe/page-title";
import { Separator } from "@/components/ui/separator";
import { MetaBase } from "@/data/meta";
import { Data, mapDependenciesToData } from "@/lib/mapping";
import { log } from "@/lib/utils";
import { Row, TableMeta } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { columns } from "./table/colums";
import { DataTable } from "@/components/datatable/data-table";
import { CombinedType,  NewButtonConfig } from "@/data/types";
import ActionButtons from "./action-buttons";
import { ConsoleLogger } from "@/lib/console.logger";

const debug = true;

const TabItems = ({_meta, _buttonConfig}:{_meta: MetaBase|undefined; _buttonConfig:NewButtonConfig}) => {
  const logger = new ConsoleLogger({ level: 'debug' });

    const dependencies = useRef<CombinedType[]>([]);
    // const selectedDependencies = useRef<any[]|undefined>(undefined);
    const [mappedDependencies, setMappedDependencies] = useState<Data[]>([]);

    const [nrOfItemsToValidate, setNrOfItemsToValidate] = useState<number>(0);

    const getNrOfItemsToValidate = () => {
        if (_meta) {
            const itemsToValidate: number = _meta.control.calculateValidationItems();
            logger.debug("TabItems", "ItemsToValidate", itemsToValidate);
            setNrOfItemsToValidate(itemsToValidate);
        }
    }

    useEffect(() => {
        logger.debug("TabItems", "UseEffect[]");

        if (_meta) {
            const _dependencies: CombinedType[] = _meta.subject.getAllDependencies();
            dependencies.current = _dependencies;
        // log(debug, "TabItems", "UseEffect[]: dependencies", _dependencies, true);

        // console.log("SET MAPPED DEPENDENCIES");
            setMappedDependencies(mapDependenciesToData(_dependencies));
            getNrOfItemsToValidate();
        }
    }, []);

    const tableMeta: TableMeta<Data[]> = {
        title: _meta ? `Available ${_meta.subject.name}` : ""
    };

    const handleChangeSelection = (selection: Row<Data>[]) => {
        logger.debug("TabItems", "handleChangeSelection", JSON.stringify(selection));

        if (_meta) {
            const selectedItemIds: number[] = selection.map((row) => row.original.id);
            logger.debug("TabItems", "handleChangeSelection: selectedItemIds", JSON.stringify(selectedItemIds));

            const selectedItems: CombinedType[] = selectedItemIds.map((id) => {
                return dependencies.current.find((d) => d.id === id)!;
            })

            logger.debug("TabItems", "handleChangeSelection: selectedItems", JSON.stringify(selectedItems));
            _meta.control.setSelection(_meta.subject.dependency, selectedItems);
            getNrOfItemsToValidate();
        }
    }

    const getSelectedItemIds = (): number[] => {
        logger.debug("TabItems", "handleGetSelection -> IDS");
        let result: number[] = [];

        if (_meta) {
            const selection: CombinedType[]|undefined = _meta.control.getSelection(_meta.subject.dependency);
            if (selection) {
                result = selection.map((item) => item.id);
            }
        }

        logger.debug("TabItems", "handleGetSelection: IDS", result, true);

        return result;
    }

    const renderComponent = () => {
        logger.debug("TabItems", "RENDER");
        
        return (
            <>
                <PageTitle className="m-2" title={_meta ? _meta.subject.name : ""} />
                <Separator />

                <div className="grid grid-cols-12">
                    <div className="col-span-11 space-y-1">
                        <DataTable columns={columns} data={mappedDependencies} tablemeta={tableMeta} handleChangeSelection={handleChangeSelection} selectedItems={getSelectedItemIds()} />
                    </div>
                    <div className=" flex justify-end">
                        <ActionButtons meta={_meta} buttonConfig={_buttonConfig} nrOfItemsToValidate={nrOfItemsToValidate}/>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>{renderComponent()}</>
    )
}

export default TabItems