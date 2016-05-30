import {Code, CodeId} from "../../model/Code";
import {IRedisClient} from "../../service/IRedisClient";
import {ICodeDataMapper} from "../../service/dataMapper/ICodeDataMapper";
import {BaseDataMapperRedis} from "./BaseDataMapperRedis";


export class CodeDataMapperRedis extends BaseDataMapperRedis<Code, CodeId> implements ICodeDataMapper {
}
